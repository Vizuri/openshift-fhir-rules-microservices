oc get events --all-namespaces -o json | jq '[.items[] | select(.involvedObject.kind == "Pod" and .reason == "Killing")]'
