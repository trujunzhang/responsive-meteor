# politiclapp

underscore

db.posts.find({createdAt:{$gte:new Date("2016-10-10")}})


onCreateUser  ==> users.new.sync

onCreateUserAsync  ==> users.new.async


profileCompletedAsync ==> users.profileCompleted.async

## Nova:users(method.js)
profileCompletedAsync ==> users.profileCompleted.async
UsersEdit ==> users.edit.sync
UsersEditAsync ==> users.edit.async


## uploads folder path in the docker image's valume

host: [[[/opt/politicl-meteor/current/bundle/programs/web.browser/app/uploads]]]
docker image: [[[/bundle/bundle/programs/web.browser/app/uploads]]]

BUNDLE_PATH=/opt/politicl-meteor/current
--volume=$BUNDLE_PATH:/bundle \

[[[/var/politicl/images-cloud]]]


## uploaded images folder path:
[[[/.meteor/local/build/programs/web.browser/app/uploads]]]

## Telescope 2.7.5(TODO list about *NewsLetter)

### Revision Number: [dc594af50f6467d8aac8b593d1d27ec731bec311] on {11/18/16}
    fix newsletter banner dismissal persistence
    
### Revision Number: [846e5c43adec378509ca9dd67ff6221e2949da15] on {11/18/16}
    rename newsletter settings
    
### Revision Number:[48cd5c83d7348eff266f5cb91abba555091015be] on {11/19/16}
    add this.props.user back to NewsletterButton
    
### Revison Number:[fc5f31b22455bc8674db85acf46dbff06eaa2102] on {11/24/16}
    move field schemas from user schema to newsletter custom fields
    
    
## Important revision numbers in the Telescope versions

### Revision Number: [464e20a96c7c81236878db95137473417b93fd02] on {11/26/16}
   eslint & clean up code, also fixed some bugs
   
#### Differents 
   [[[Telescope/packages/nova-core/lib/callbacks.js]]]
   [[[politicl-meteor/packages/nova-lib/lib/utils.js]]]   
   [[[politicl-meteor/packages/nova-newsletter/lib/custom_fields.js]]]   
   
   
## third library
### https://github.com/efounders/meteor-accounts-passwordless   
   

## Click animation

http://stackoverflow.com/questions/24111813/how-can-i-animate-a-react-js-component-onclick-and-detect-the-end-of-the-animati
     
     
## color schema
link's normal color: #5898f1
link's hover color: #71a8f4

### popover close 
normal: #bbb || #1e1e1e
hover: #1ca0d8



     
     
    
    
 
 
