Example UML with Color


```
@startuml

title My Website

actor "End User" as User
box "\nClients" #F5FBEF
    participant "Mobile\nApp" as Mobile
    participant "Web\nApp" as Web
end box
box "\nAPI"
    control "Auth\nAPI" as Auth
    control "App\nAPIs" as API
end box
box "\nResources"
    collections "S3\nStorage" as S3
    database "Database" as DB
end box
box "\nThirdparty" #EFF2FB
    control "Google\nAPI" as Google #CEECF5
    control "AWS\nAPI" as AWS #FFFF00
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

title My Website

actor "End User" as User
box "\nClients"
    participant "Mobile\nApp" as Mobile
    participant "Web\nApp" as Web
end box
box "\nAPI"
    control "Auth\nAPI" as Auth
    control "App\nAPIs" as API
end box
box "\nResources"
    collections "S3\nStorage" as S3
    database "Database" as DB
end box
box "\nThirdparty"
    control "Google\nAPI" as Google
    control "AWS\nAPI" as AWS
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

With Activations

```
User ->> Web: Request page
activate Web
Web ->> User: Home page
User ->> Web: Login
Note right of Auth: *TODO* Use Oauth2
Web ->> Auth: Validate
activate Auth
opt Success
    Auth ->> Web : Success message
    Web ->> API: Get data
    activate API
    API ->> DB: Get data
    activate DB
    DB ->> API: Profile info
    deactivate DB
    API ->> Web: Profile info
    deactivate API
    Web ->> User: Profile page
end
opt Failure
    Auth ->> Web: Error
    Web ->> User: Error page
end
deactivate Auth
deactivate Web
```