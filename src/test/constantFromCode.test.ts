import * as assert from "assert";
import { inferConstantFromCode, findAllConstants } from "../constantFromCode";

suite("constantFromCode", () => {
  test("infers simple class name", () => {
    const code = `class User
  def name
    'John'
  end
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "User");
  });

  test("infers namespaced class name", () => {
    const code = `class Hub::ApiController
  def index
    render json: {}
  end
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "Hub::ApiController");
  });

  test("infers module name", () => {
    const code = `module Authentication
  def authenticate
    # ...
  end
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "Authentication");
  });

  test("infers deeply namespaced class name", () => {
    const code = `class Api::V1::AccountsController < ApplicationController
  def show
    # ...
  end
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "Api::V1::AccountsController");
  });

  test("returns undefined for no class or module", () => {
    const code = `def some_method
  puts "Hello"
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, undefined);
  });

  test("finds first class when multiple definitions exist", () => {
    const code = `class FirstClass
end

class SecondClass
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "FirstClass");
  });

  test("handles indented class definitions", () => {
    const code = `  class IndentedClass
    def method
    end
  end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "IndentedClass");
  });

  test("handles class with inheritance", () => {
    const code = `class UsersController < ApplicationController
  # ...
end`;
    const result = inferConstantFromCode(code);
    assert.strictEqual(result, "UsersController");
  });

  suite("findAllConstants", () => {
    test("finds multiple classes and modules", () => {
      const code = `module Api
  class UsersController
  end

  class PostsController
  end
end`;
      const result = findAllConstants(code);
      assert.deepStrictEqual(result, ["Api", "UsersController", "PostsController"]);
    });

    test("returns empty array when no constants found", () => {
      const code = `def some_method
  puts "Hello"
end`;
      const result = findAllConstants(code);
      assert.deepStrictEqual(result, []);
    });

    test("finds namespaced constants", () => {
      const code = `class Hub::Api::V1::Controller
end

module Services::UserSync
end`;
      const result = findAllConstants(code);
      assert.deepStrictEqual(result, ["Hub::Api::V1::Controller", "Services::UserSync"]);
    });
  });
});
