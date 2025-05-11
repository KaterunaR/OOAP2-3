class Command {
    execute() {}
    undo() {}
}

class FastFoodKitchen {
    constructor() {
        this.orders = [];
    }

    addOrder(item) {
        console.log(`Замовлення додано: ${item}`);
        this.orders.push(item);
        this.updateOrderList();
    }

    removeOrder(item) {
        const index = this.orders.indexOf(item);
        if (index > -1) {
            this.orders.splice(index, 1);
            console.log(`Замовлення скасовано: ${item}`);
            this.updateOrderList();
        } else {
            console.log(`Не знайдено замовлення: ${item}`);
        }
    }

    listOrders() {
        return this.orders.join(', ') || 'немає';
    }

    updateOrderList() {
        const list = document.getElementById('orderList');
        list.innerHTML = '';
        this.orders.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item + ' ';
    
            const removeBtn = document.createElement('button');
            removeBtn.style.backgroundColor = '#fd7b7b';
            removeBtn.textContent = 'видалити';
            removeBtn.onclick = () => {
                const command = new RemoveOrderCommand(this, item);
                invoker.run(command);
            };
    
            li.appendChild(removeBtn);
            list.appendChild(li);
        });
    }
    
}

class AddOrderCommand extends Command {
    constructor(kitchen, item) {
        super();
        this.kitchen = kitchen;
        this.item = item;
    }

    execute() {
        this.kitchen.addOrder(this.item);
    }

    undo() {
        this.kitchen.removeOrder(this.item);
    }
}

class RemoveOrderCommand extends Command {
    constructor(kitchen, item) {
        super();
        this.kitchen = kitchen;
        this.item = item;
    }

    execute() {
        this.kitchen.removeOrder(this.item);
    }

    undo() {
        this.kitchen.addOrder(this.item);
    }
}

class OrderInvoker {
    constructor() {
        this.history = [];
    }

    run(command) {
        command.execute();
        this.history.push(command);
    }

    undo() {
        const command = this.history.pop();
        if (command) {
            command.undo();
        } else {
            console.log("Немає команд для скасування.");
        }
    }
}

const kitchen = new FastFoodKitchen();
const invoker = new OrderInvoker();

document.getElementById('addOrderBtn').addEventListener('click', () => {
    const input = document.getElementById('orderInput');
    if(input.value != ''){
        const command = new AddOrderCommand(kitchen, input.value);
        invoker.run(command);
        input.value = '';
    }
    else{
        alert('Виберіть замовлення!!!')
    }
});

document.getElementById('undoBtn').addEventListener('click', () => {
    invoker.undo();
});