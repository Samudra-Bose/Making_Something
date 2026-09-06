while ($true) {
    Start-Sleep -Seconds 120
    git add .
    git commit -m "chore: auto-push during signature interaction pass"
    git push
}
