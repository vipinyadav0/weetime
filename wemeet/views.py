from calendar import c
import imp
from unicodedata import name
from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time
import json

from .models import RoomMember

from django.views.decorators.csrf import csrf_exempt


# Create your views here.

def lobby(request):
    return render(request, 'wemeet/lobby.html')


def room(request):
    return render(request, 'wemeet/room.html')

def getToken(request):
    appId = "2de72de1883447d3a8a623fb9d2d8e37"
    appCertificate = "d001e9bb5c274cfb804433ed569493d2"
    
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 7200 * 24
    currentTimestamp = time.time()
    privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    role = 1
    
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token' : token, 'uid':uid}, safe = False)


@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid = data['UID'],
        room_name = data['room_name']
    )
    return JsonResponse({'name' : data['name']}, safe=False)


def getMember(request):
    uid = request.GET.get('UID')
    room_name  = request.GET.get('room_name')
    
    member = RoomMember.objects.get(
        uid = uid,
        room_name = room_name,
        
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    
    member = RoomMember.objects.get(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name'],
        
    )
    member.delete()
    return JsonResponse('Memeber was deleted', safe=False)