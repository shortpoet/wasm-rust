# rust

## learning rust through second state

- run container
- cd to example dir
- run

```bash
docker run -p 3000:3000 --rm -it -v $(pwd):/app secondstate/ssvm-nodejs-starter:v1
```

## vercel

- testing vercel deployment

## docs branch

- trigger gh deploy

## usage

- run docker container 

```bash
cd docker
./dev/build.sh
./dev/run.sh
```

- don't forget to bring down the container properly after

```bash
./dev/down.sh
```

- to start with fresh image wipe then build again

```bash
./dev/wipe.sh
```
