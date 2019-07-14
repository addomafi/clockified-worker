# clockified-worker

A tool to reduce the job to add time entries on Clockify.

Every month i need to spend time to fill my timesheet on Clockify, it hurts because the UI doens't help us to fill all the working days with the same pattern of working hours. This is why I made this little tool to help me on these repeatedly task.

## How to Use

It's simple as this:
```
npm install -g clockified-worker

clockified --workspaceId your_workspace_id --projectId your_project_id --description your_job_description --startFrom 2019-05-04 --untilTo 2019-05-31 --apiKey your_api_key
```

If you need help, just type:
```
clockified --help
```
