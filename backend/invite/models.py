'''models for invite model'''
from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from workstream.models import Workstream


class Invite(models.Model):
    '''
    Invite model
    '''
    workstream = models.ForeignKey(
        Workstream, on_delete=models.CASCADE, related_name='ws_invite')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user_invite')
    accepted = models.BooleanField(default=False)
    inbound = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.inbound:
            return f'{self.user} join request for {self.workstream}'
        else:
            return f'{self.user} invited to {self.workstream}'


def accept_request(sender, instance, created, **kwargs):
    '''
    Signal to handle adding user to workstream once accepted
    '''
    if instance.accepted:
        ws = Workstream.objects.get(id=instance.workstream.id)
        ws.users.add(instance.user)
        instance.delete()


post_save.connect(accept_request, sender=Invite)
