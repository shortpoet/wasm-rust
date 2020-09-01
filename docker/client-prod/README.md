# client-prod

## notes

- .env file in this directory is hard copied during build and sets client internal env vars vs container env vars which are set in azure command

## nginx

- [sample conf](https://gist.github.com/sdras/2bfe545bb4df9a1a8e03b7ba73b086d5)
- [entrypoint](https://dev.to/enkaypeter/how-to-deploy-a-vue-application-on-cloud-run-3efl)
- [vue on openshift w/ nginx](https://www.openshift.com/blog/deploy-vuejs-applications-on-openshift)
- [nginx from alpine](https://jonathanmh.com/deploying-a-vue-js-single-page-app-including-router-with-docker/)
- [template](https://marcofranssen.nl/nginx-1-19-supports-environment-variables-and-templates-in-docker/)
- [directory structure (debian wiki)](https://wiki.debian.org/Nginx/DirectoryStructure)
- [nginx w/ certs](https://www.cloudbooklet.com/how-to-install-nginx-and-lets-encrypt-with-docker-ubuntu-20-04/)
- [reverse proxy](https://dev.to/domysee/setting-up-a-reverse-proxy-with-nginx-and-docker-compose-29jg)
- [more setup and proxy](https://deploybot.com/blog/guest-post-how-to-set-up-and-deploy-nodejs-express-application-for-production)

## testing

### ip address

- <https://serverfault.com/questions/443949/how-to-test-a-https-url-with-a-given-ip-address>
- <https://unix.stackexchange.com/questions/167077/sending-curl-request-with-custom-ip>
- <https://www.keycdn.com/support/url-to-ip>