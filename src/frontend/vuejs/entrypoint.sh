#!bin/sh
ROOT_DIR=./dist
# Replace env vars in files served by NGINX
for file in $ROOT_DIR/js/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  sed -i 's|VUE_HOSTNAME_PLACEHOLDER|'${SERVER_HOSTNAME}'|g' $file
  # Your other variables here...
done

exec "$@"