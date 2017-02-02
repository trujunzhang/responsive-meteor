[
  "build",
  "--directory",
  "/tmp/d955da6f-81f3-46fb-a0c5-eaafe60d3dab",
  "--architecture",
  "os.linux.x86_64",
  "--server",
  "http://localhost:3000",
  "--debug",
  "--server-only"
]

meteor npm install --production

meteor --verbose


meteor build .
meteor build  --directory  /tmp/d955da6f-81f3-46fb-a0c5-eaafe60d3dab  --architecture  os.linux.x86_64  --server  http://localhost:3000  --debug  --server-only


