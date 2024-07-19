from django.db.models import Count
from django.db.models import Q
from rest_framework import generics
from backend.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer, WorkstreamSwitchSerializer, EditProfileSerializer


class ProfileList(generics.ListAPIView):
    """
    List all profiles.
    No create view as profile creation is handled by django signals.
    """
    queryset = Profile.objects.all().order_by('-created_at')
    serializer_class = ProfileSerializer


class ProfileInviteList(generics.ListAPIView):
    """
    List all profiles.
    No create view as profile creation is handled by django signals.
    """
    serializer_class = ProfileSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return Profile.objects.exclude(owner__user_participant__workstream=user.profile.default_workstream).exclude(owner__user_invite__workstream=user.profile.default_workstream)


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a profile if you're the owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all().annotate(
        completed=Count('owner__user', filter=Q(owner__user__is_completed=True)),
        pending=Count("owner__user", filter=Q(owner__user__is_completed=False))
    ).order_by('-created_at')
    serializer_class = EditProfileSerializer


class ProfileSwitchWorkstream(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = WorkstreamSwitchSerializer
    queryset = Profile.objects.all().order_by('-created_at')
