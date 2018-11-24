Example UML with Color


```
@startuml

title "My Website"

actor "End User" as User
box "\nClients" #F5FBEF
participant "Mobile\nApp" as Mobile
participant "Web\nApp" as Web
end box
box "\nAPI"
control "\nAuth\nAPI" as Auth
control "\nApp\nAPIs" as API
end box
box "\nResources"
collections "\nS3\nStorage" as S3
database "\nDatabase" as DB
end box
box "\nThirdparty" #EFF2FB
control "\nGoogle\nAPI" as Google #CEECF5
control "\nAWS\nAPI" as AWS #FFFF00
end box

== User Launches Site ==

User -> Web: Request page
User <- Web: Home page

== User Login ==

User -> Web: Login

Web -> Auth: Validate
opt Success
    Web <- Auth: Success message
    Web -> API: Get data
    API -> DB: Get data
    API <- DB: Profile info
    Web <- API: Profile info
    User <- Web: Profile page
end
opt Failure
    Web <- Auth: Error
    User <- Web: Error page
end


@enduml

```

Example without color

```
@startuml


title "My Website"

actor "End User" as User
box "\nClients"
participant "Mobile\nApp" as Mobile
participant "Web\nApp" as Web
end box
box "\nAPI"
control "\nAuth\nAPI" as Auth
control "\nApp\nAPIs" as API
end box
box "\nResources"
collections "S3\nStorage" as S3
database "\nDatabase" as DB
end box
box "\nThirdparty"
control "\nGoogle\nAPI" as Google
control "\nAWS\nAPI" as AWS
end box

== User Launches Site ==

User -> Web: Request page
User <- Web: Home page

== User Login ==

User -> Web: Login

Web -> Auth: Validate
opt Success
    Web <- Auth: Success message
    Web -> API: Get data
    API -> DB: Get data
    API <- DB: Profile info
    Web <- API: Profile info
    User <- Web: Profile page
end
opt Failure
    Web <- Auth: Error
    User <- Web: Error page
end

@enduml
```