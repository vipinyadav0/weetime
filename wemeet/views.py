import imp
from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time


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

