# Regional Certificate Templates

Place final certificate artwork here using one PNG per region:

```text
china.png
india.png
indonesia.png
latam.png
nigeria.png
russia.png
korea.png
turkey.png
ukraine.png
vietnam.png
```

The app will load `/certificates/{region}.png`, draw the learner username on top, and export the rendered canvas as a PNG. If a template is missing, the certificate page uses a generated placeholder.

Use a 1600x1000 PNG when possible. Other dimensions work, but username placement is scaled from the 1600x1000 baseline.
