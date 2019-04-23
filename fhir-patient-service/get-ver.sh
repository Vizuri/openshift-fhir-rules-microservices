FOO=$(mvn help:evaluate -Dexpression=project.version  -DforceStdout -q)
echo $FOO
