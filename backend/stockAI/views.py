from django.shortcuts import render
import json

# Create your views here.
def index(request):
    return render(request, 'index.html')

def profile(request):
    user=request.user

    auth0_user=user.social_auth.get(provider='auth0')

    user_data={
        'user_id':auth0_user.user.uid,
        'name':auth0_user.firstname,
        'picture':auth0_user.extra_data['picture']
    }

    context={
        'user_data':json.dumps(user_data,indent=4),
        'auth0_user':auth0_user
    }

    return render(request,'profile.html',context)