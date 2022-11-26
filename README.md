# Next.js TesloShop App
Para correr localmente, se necesita la bbdd
```
    docker-compose up -d
```

* El -d, significa __detached__

## Configurar las variables de entorno
Renombrar el archivo __.en.template__ a __.env__

* MongoDB URL local: 
```
    mongoDB://localhost:27017/tesloDb
```

* Reconstruir los módulos de node y levantar Next
```
yarn install
yarn dev
```



# Llenar la bbdd con información de pruebas
Llamar a:
```
    http://localhost:3000/api/seed
```