defmodule MemoryWeb.PageControllerTest do
  use MemoryWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Join a Game"
  end

  test "GET /game", %{conn: conn} do
    conn = get conn, "/game"
    assert "/" = redirect_path = redirected_to(conn, 302)
    conn = get(recycle(conn), redirect_path)
    assert html_response(conn, 200) =~ "Join a Game"
  end

  test "GET /game/demo", %{conn: conn} do
    conn = get conn, "/game/demo"
    assert html_response(conn, 200) =~ "Memory Game: demo"
  end

  test "POST /game", %{conn: conn} do
  	conn = post conn, "/game", [name: "demo"]
  	assert "/game/demo" = redirect_path = redirected_to(conn, 302)
  	conn = get(recycle(conn), redirect_path)
  	assert html_response(conn, 200) =~ "Memory Game: demo"
  end
end
