from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

RESTAURANT_NAME = "Tasty Bite"

# sku = stock keeping unit
menu = {
    "sku1": {
        "name": "Hamburger",
        "price": 6.51
    },
    "sku2": {
        "name": "Cheeseburger",
        "price": 7.75
    },
    "sku3": {
        "name": "Milkshake",
        "price": 5.99
    },
    "sku4": {
        "name": "Fries",
        "price": 2.39
    },
    "sku5": {
        "name": "Sub",
        "price": 5.87
    },
    "sku6": {
        "name": "Ice Cream",
        "price": 1.55
    },
    "sku7": {
        "name": "Fountain Drink",
        "price": 3.45
    },
    "sku8": {
        "name": "Cookie",
        "price": 3.15
    },
    "sku9": {
        "name": "Brownie",
        "price": 2.46
    },
    "sku10": {
        "name": "Sauce",
        "price": 0.75
    }
}

SALES_TAX = 0.08
cart = {}


def add_to_cart(sku, quantity=1):
    if sku in menu:
        if sku in cart:
            cart[sku] += quantity
        else:
            cart[sku] = quantity
        return True, f"Added {quantity} of {menu[sku]['name']} to the cart."
    else:
        return False, f"Error: the item number ({sku}) entered does not exist."


def remove_from_cart(sku):
    if sku in cart:
        cart.pop(sku)
        return True, f"Removed {menu[sku]['name']} from the cart."
    else:
        return False, f"The item with SKU {sku} is not in the cart."


def modify_cart(sku, quantity):
    if sku in cart:
        if quantity > 0:
            cart[sku] = quantity
            return True, f"Modified {menu[sku]['name']} cart quantity to {quantity}."
        else:
            return remove_from_cart(sku)
    else:
        return False, f"The item {menu[sku]['name']} is not currently in the cart."


def view_cart():
    items = []
    subtotal = 0
    for sku in cart:
        if sku in menu:
            quantity = cart[sku]
            line_total = menu[sku]["price"] * quantity
            subtotal += line_total
            items.append({
                "sku": sku,
                "name": menu[sku]["name"],
                "price": menu[sku]["price"],
                "quantity": quantity,
                "line_total": round(line_total, 2)
            })
    tax = subtotal * SALES_TAX
    total = subtotal + tax
    return {
        "items": items,
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "total": round(total, 2)
    }


def checkout():
    result = view_cart()
    cart.clear()
    return result

# API Routes

@app.get("/api/info")
def get_info():
    return jsonify({"name": RESTAURANT_NAME, "sales_tax": SALES_TAX})


@app.get("/api/menu")
def get_menu():
    items = [{"sku": sku, **data} for sku, data in menu.items()]
    return jsonify(items)


@app.get("/api/cart")
def get_cart():
    return jsonify(view_cart())


@app.post("/api/cart/add")
def api_add_to_cart():
    body = request.get_json()
    sku = body.get("sku")
    quantity = int(body.get("quantity", 1))
    ok, message = add_to_cart(sku, quantity)
    if not ok:
        return jsonify({"error": message}), 400
    return jsonify({"message": message, **view_cart()})


@app.put("/api/cart/modify")
def api_modify_cart():
    body = request.get_json()
    sku = body.get("sku")
    quantity = int(body.get("quantity", 1))
    ok, message = modify_cart(sku, quantity)
    if not ok:
        return jsonify({"error": message}), 400
    return jsonify({"message": message, **view_cart()})


@app.delete("/api/cart/<sku>")
def api_remove_from_cart(sku):
    ok, message = remove_from_cart(sku)
    if not ok:
        return jsonify({"error": message}), 400
    return jsonify({"message": message, **view_cart()})


@app.post("/api/checkout")
def api_checkout():
    order = checkout()
    return jsonify({"message": "Your order has been received. Thank you!", "order": order})


if __name__ == "__main__":
    app.run(debug=True, port=3001)
