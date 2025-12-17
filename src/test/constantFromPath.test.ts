import * as assert from "assert";
import { inferConstantFromPath } from "../constantFromPath";
import { ExtensionConfig } from "../configuration";

suite("constantFromPath", () => {
  const defaultConfig: ExtensionConfig = {
    rootPrefixes: ["app/models", "app/controllers", "app/jobs", "app/services", "lib"],
    useCodeInference: false,
    acronyms: {},
    inferencePreference: "path",
  };

  const workspaceRoot = "/Users/test/project";

  test("infers simple controller class name", () => {
    const result = inferConstantFromPath(
      `${workspaceRoot}/app/controllers/users_controller.rb`,
      workspaceRoot,
      defaultConfig,
    );
    assert.strictEqual(result, "UsersController");
  });

  test("infers namespaced controller class name", () => {
    const result = inferConstantFromPath(
      `${workspaceRoot}/app/controllers/hub/api_controller.rb`,
      workspaceRoot,
      defaultConfig,
    );
    assert.strictEqual(result, "Hub::ApiController");
  });

  test("infers deeply nested class name", () => {
    const result = inferConstantFromPath(
      `${workspaceRoot}/app/controllers/api/v1/accounts_controller.rb`,
      workspaceRoot,
      defaultConfig,
    );
    assert.strictEqual(result, "Api::V1::AccountsController");
  });

  test("infers simple model class name", () => {
    const result = inferConstantFromPath(`${workspaceRoot}/app/models/user.rb`, workspaceRoot, defaultConfig);
    assert.strictEqual(result, "User");
  });

  test("infers namespaced model class name", () => {
    const result = inferConstantFromPath(
      `${workspaceRoot}/app/models/hub/oauth_client.rb`,
      workspaceRoot,
      defaultConfig,
    );
    assert.strictEqual(result, "Hub::OauthClient");
  });

  test("infers lib class name", () => {
    const result = inferConstantFromPath(`${workspaceRoot}/lib/money/formatter.rb`, workspaceRoot, defaultConfig);
    assert.strictEqual(result, "Money::Formatter");
  });

  test("infers service class name", () => {
    const result = inferConstantFromPath(
      `${workspaceRoot}/app/services/admin/user_sync/service.rb`,
      workspaceRoot,
      defaultConfig,
    );
    assert.strictEqual(result, "Admin::UserSync::Service");
  });

  test("returns undefined for non-Ruby files", () => {
    const result = inferConstantFromPath(
      `${workspaceRoot}/app/controllers/users_controller.js`,
      workspaceRoot,
      defaultConfig,
    );
    assert.strictEqual(result, undefined);
  });

  test("handles acronyms when configured", () => {
    const configWithAcronyms: ExtensionConfig = {
      ...defaultConfig,
      acronyms: {
        api: "API",
        oauth: "OAuth",
      },
    };

    const result = inferConstantFromPath(
      `${workspaceRoot}/app/models/hub/oauth_client.rb`,
      workspaceRoot,
      configWithAcronyms,
    );
    assert.strictEqual(result, "Hub::OAuthClient");
  });

  test("handles multiple acronyms in same file", () => {
    const configWithAcronyms: ExtensionConfig = {
      ...defaultConfig,
      acronyms: {
        api: "API",
        v1: "V1",
      },
    };

    const result = inferConstantFromPath(
      `${workspaceRoot}/app/controllers/api/v1/users_controller.rb`,
      workspaceRoot,
      configWithAcronyms,
    );
    assert.strictEqual(result, "API::V1::UsersController");
  });

  test("handles file without prefix", () => {
    const result = inferConstantFromPath(`${workspaceRoot}/config/application.rb`, workspaceRoot, defaultConfig);
    assert.strictEqual(result, "Config::Application");
  });

  test("uses longest matching prefix", () => {
    const configWithNestedPrefixes: ExtensionConfig = {
      ...defaultConfig,
      rootPrefixes: ["app", "app/controllers"],
    };

    const result = inferConstantFromPath(
      `${workspaceRoot}/app/controllers/users_controller.rb`,
      workspaceRoot,
      configWithNestedPrefixes,
    );
    // Should strip 'app/controllers' not just 'app'
    assert.strictEqual(result, "UsersController");
  });
});
