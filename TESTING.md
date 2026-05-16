# Testing the Ruby Class Name Extension

This guide explains how to test the VS Code extension locally in your existing Ruby projects.

## Quick Start

### 1. Build the Extension

From the extension directory:

```bash
# Using mise
mise run compile

# Or using pnpm directly
pnpm install
pnpm run compile
```

### 2. Install the Extension Locally

#### Option A: Install from VSIX (Recommended)

1. Package the extension:

   ```bash
   mise run package
   # Or: pnpm exec vsce package
   ```

2. Install in VS Code:

   ```bash
   code --install-extension ruby-class-name-0.1.0.vsix
   ```

3. Reload VS Code

#### Option B: Run in Extension Development Host

1. Open the extension directory in VS Code:

   ```bash
   code /path/to/vscode-ruby-class-name
   ```

2. Press `F5` to launch a new Extension Development Host window

3. In the new window, open your Ruby project

## Testing in Your Ruby Project

### Basic Test

1. Open any Ruby file in your project (e.g., `app/controllers/users_controller.rb`)

2. Use the keyboard shortcut:
   - **Mac**: `Cmd+Shift+C`
   - **Windows/Linux**: `Ctrl+Shift+C`

3. Or use the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):
   - Type: "Ruby: Copy class name for active file"
   - Press Enter

4. Check the status bar for a notification like: `Copied: UsersController`

5. Paste the clipboard contents to verify the class name

### Test Cases

Try the extension on different file types in your Rails project:

#### Controllers

| File                                         | Expected Result            |
| -------------------------------------------- | -------------------------- |
| `app/controllers/users_controller.rb`        | `UsersController`          |
| `app/controllers/admin/users_controller.rb`  | `Admin::UsersController`   |
| `app/controllers/api/v1/posts_controller.rb` | `Api::V1::PostsController` |

#### Models

| File                       | Expected Result |
| -------------------------- | --------------- |
| `app/models/user.rb`       | `User`          |
| `app/models/admin/role.rb` | `Admin::Role`   |

#### Other Rails Directories

| File                                        | Expected Result           |
| ------------------------------------------- | ------------------------- |
| `app/services/user_registration_service.rb` | `UserRegistrationService` |
| `app/jobs/send_email_job.rb`                | `SendEmailJob`            |
| `lib/utils/formatter.rb`                    | `Utils::Formatter`        |

### Testing Custom Configuration

Create a `.vscode/settings.json` in your project to test custom configurations:

#### Test Acronyms

```json
{
  "rubyClassName.acronyms": {
    "api": "API",
    "oauth": "OAuth",
    "url": "URL",
    "http": "HTTP"
  }
}
```

Now test files like:

- `app/models/oauth_client.rb` → Should copy `OAuthClient` (not `OauthClient`)
- `app/controllers/api/users_controller.rb` → Should copy `API::UsersController`

#### Test Custom Root Prefixes

For non-standard Rails directories or engines:

```json
{
  "rubyClassName.rootPrefixes": [
    "app/models",
    "app/controllers",
    "engines/my_engine/app/models",
    "engines/my_engine/app/controllers"
  ]
}
```

#### Test Code-Based Inference

Enable code-based inference to test regex matching:

```json
{
  "rubyClassName.useCodeInference": true,
  "rubyClassName.inferencePreference": "code"
}
```

This will parse the actual Ruby file to find `class` or `module` definitions.

## Running Unit Tests

### Run All Tests

```bash
# Using mise
mise run test:unit

# Or using pnpm
pnpm run test:unit
```

### Watch Mode

For development, you can watch for changes:

```bash
# Using mise
mise run watch

# Or using pnpm
pnpm run watch
```

## Debugging

### Debug in Extension Development Host

1. Open the extension directory in VS Code
2. Set breakpoints in the TypeScript source files
3. Press `F5` to launch the Extension Development Host
4. Use the extension in the new window
5. Check the Debug Console in the original window for output

### View Extension Logs

1. In VS Code, open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type: "Developer: Show Logs"
3. Select "Extension Host"

## Troubleshooting

### Extension Not Working

1. Verify the extension is installed:

   ```bash
   code --list-extensions | grep ruby-class-name
   ```

2. Check VS Code's extension logs for errors

3. Reload VS Code window (`Cmd+R` / `Ctrl+R`)

### Incorrect Class Names

1. Check your workspace configuration (`.vscode/settings.json`)
2. Verify the file path matches expected patterns
3. Test with path-based inference first, then try code-based inference

### Keyboard Shortcut Not Working

The default shortcut `Cmd+Shift+C` / `Ctrl+Shift+C` might conflict with other extensions.

To change it:

1. Open Keyboard Shortcuts: `Cmd+K Cmd+S` / `Ctrl+K Ctrl+S`
2. Search for: "Ruby: Copy class name"
3. Click the pencil icon to edit
4. Press your desired key combination

## Testing Different Scenarios

### Edge Cases to Test

1. **File without standard prefix**
   - `config/application.rb` → `Config::Application`

2. **Multiple namespace levels**
   - `app/controllers/api/v2/admin/users_controller.rb` → `Api::V2::Admin::UsersController`

3. **Non-Ruby file**
   - `app/controllers/users_controller.js` → Should show error

4. **File not in workspace**
   - Try opening a Ruby file outside your workspace → Should show error

## Uninstalling for Testing

To test fresh installation:

```bash
# Uninstall the extension
code --uninstall-extension andrewmcodes.ruby-class-name

# Remove workspace settings
rm .vscode/settings.json
```

## Reporting Issues

If you encounter issues during testing:

1. Note the Ruby file path
2. Note the expected vs. actual result
3. Check your configuration (`.vscode/settings.json`)
4. Check the extension logs
5. Include VS Code version: Help → About
