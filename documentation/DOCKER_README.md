## Install Docker on Windows:
### Install Docker for Hyper-V
Windows Pro and Enterprise support Docker in Hyper-V. This is the recommended way to install Docker on Windows.
- Download and Install [Docker](https://www.docker.com/products/docker#/windows)
- You might need to activate [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

### Install Docker Toolbox:
Windows less than Pro do not come with Hyper-V. Therefore you need Docker Toolbox.
- Install [Oracle Virtual Box](https://www.virtualbox.org/)
- Download and install [Docker Toolbox](https://www.docker.com/products/docker-toolbox)
- Install [Kitematic](https://kitematic.com). This should be part of the Docker Toolbox Installer.
- In a terminal (cmd/powershell/MinGw etc.) run `docker-machine create --driver virtualbox default`

## Install Docker on Linux
Run the following commands in a shell:
```
sudo -i
curl -sSL https://get.docker.com/ | sh
curl -L https://github.com/docker/compose/releases/download/1.9.0/docker-compose-'uname -s'-'uname -m' > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
exit
```

## Run Docker on Windows:
### Docker
If you configured Docker to start on startup, it should running and its icon be in the tray.
Else start it manually.

### Docker Toolbox:
- Open Virtual Box, make sure there is a entry default and this is turned off.
  - If it is not, then turn it off: `Right click -> Shutdown -> Shutdown`
  - If it says canceled you need to turn it first on, and then off.
- In a terminal (cmd/powershell/MinGw etc.) run:
  - `docker-machine start default`
  - `docker-machine env`
  - Running `docker-machine env --shell <YOU_SHELL>` will give instructions on how to setup your environment:
    - On dos (cmd) based shells ```@FOR /f "tokens=*" %i IN (`docker-machine env --shell cmd`) DO@%i```
    - On tty (mingw) `eval $("C:\Program Files\Docker Toolbox\docker-machine.exe" env)`

### Docker informations on Windows:
Use kitematic. If the basic setup fails: Click use VirtualBox, skip registration.
In the settings under port, tab it shows e.g. the IP-address.


## Run Docker on Linux:
- `docker-machine start default`
- `docker-machine env`
- `docker-compose up`

### Docker information on Linux:
- `ifconig` (ips)
- `route` (ips, gateway)
- `docker ps` All (running) Docker containers (`-a` flag to show all containers)
- `docker inspect <container id> (details), docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name_or_id` IP-address of Docker
- `docker exec -it <container> bash` get into a container (open a shell inside)


## Starting your containers
- If you project has a `docker-compose.yml`, in the directory with that file run `docker-compose up` or `docker-compose -d` for detached mode (no log)
- Use `docker-compose stop` to stop the containers
- Use `docker-compose build` to build the containers
- Use `docker-compose rm` to delete the containers
- Use `docker ps` to show running containers, `docker ps -a` for all existing containers
- If running in detached mode you can view the logs with `docker logs <CONTAINER_NAME>`


## Common Problems
### With `docker-machine env`
- Cerificate error: follow instructions displayed

### With ```docker-compose up```
- Docker containers may not have been build correctly. Build manually: `docker-compose build --no-cache`
- Specified port is already use: Find the process that is blocking the port and kill it. If that is not possible you can change the port maping in `docker-compose.yml` (see [compose-file docs](https://docs.docker.com/compose/compose-file/))
- The browser shows `Forbidden`: The nginx container was unable to mount the directory it should serve. Make sure it exists (or rebuild it) and restart the nginx container.
- The browser shows `NotFound`: The files to serve are missing in the nginx container. Make sure they exist and are mounted propery.
- Docker cannot mount a directory: Make sure Docker has access and privileges to mount for that directory.
  - On Windows with Docker Toolbox, the Project should be in `%HOMEPATH%/Documents` (i.e. you Documents dir)
  - On Windows with Hyper-V grant mount privilege in the Docker Settings (from the Tray Icon)
  - On OSX grant mount privilege in the Docker Settings (from the Tray Icon)


# Postgres Connection
- To connect to a docker-postgres: host:postgres-db, port:54321 (like in docker-compse.yml
- To connect to a postgres HostDatabase: Same as to any postgres server with ip address of your computer.
   - add your ip in dbconfig
   - make sure your ip address is in pg_hba.conf (ubuntu in: /etc/postgresql/...)
   (e.g. all: `host    all             all             0.0.0.0/0               md5`)
   - make sure you listen to that addresses, edit postgresql.conf, same dir as pg_hba.conf (or all i.e. : `listen_addresses = '*'`)

# If you have windows pro or higher and don't require VirtualBox for other porjects:
You can install docker directly and linux commands will probably work
