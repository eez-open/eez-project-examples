# EEZ Project Examples

A curated collection of example projects for [EEZ Studio](https://github.com/eez-open/studio).

## Overview

This repository contains ready-to-use example projects that demonstrate various features and capabilities of EEZ Studio. Browse and download examples directly from within EEZ Studio's **Examples** tab.

## Categories

Examples are organized by project type and complexity:

- **Dashboard** - Data visualization, charts, and control panel examples
- **EEZ-GUI** - Embedded GUI examples using EEZ Framework
- **LVGL** - Examples using the LVGL graphics library

## Using Examples

### From EEZ Studio (Recommended)

1. Open EEZ Studio
2. Go to the **Examples** tab
3. Browse available examples
4. Click on an example to create a new project based on it

### Manual Download

1. Clone this repository or download individual examples
2. Open the `.eez-project` file in EEZ Studio

## Contributing

We welcome community contributions! To submit your own example:

1. Fork this repository
2. Add your `.eez-project` file(s) inside the `examples` folder under the appropriate subfolder
3. Submit a pull request

### Example Requirements

Each `.eez-project` file must have the following properties defined inside **Settings → General**:

| Property | Required | Description |
|----------|----------|-------------|
| Description | Yes | Brief description of what the example demonstrates |
| Image | Yes | Preview image for the example |
| Keywords | Yes | Search keywords for discoverability |
| Target Platform | No | Hardware platform the example targets |
| Target Platform Link | No | URL to the target platform documentation |

> **Note:** The example name displayed in EEZ Studio is extracted from the `.eez-project` filename (excluding the extension). Choose your filename carefully.

### Review Process

All pull requests must be approved by the EEZ team. Each `.eez-project` file is subject to a comprehensive inspection to ensure it does not contain malicious code.

### Example Requirements

- Clean, well-documented project structure
- Brief description of what the example demonstrates
- Screenshot or preview image (recommended)

## Related Projects

- [EEZ Studio](https://github.com/eez-open/studio) - Cross-platform visual development tool
- [EEZ Project Templates](https://github.com/eez-open/eez-project-templates) - Starter templates for new projects
- [EEZ Framework](https://github.com/eez-open/eez-framework) - Embedded GUI framework

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Individual examples may have their own licenses as specified by their authors.


