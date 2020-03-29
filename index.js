const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse,Body,Events } = Matter;

const cellRow = 5;
const cellCol = 5;
const height = window.innerHeight;
const width = window.innerWidth;
const unitX = width / cellCol;
const unitY = height / cellRow;
const engine = Engine.create();
engine.world.gravity.y=0;
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: width,
        height: height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

World.add(
    world,
    MouseConstraint.create(engine, {
        mouse: Mouse.create(render.canvas)
    })
);
const wall = [
    //up and down
    Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 20, { isStatic: true }),

    //left and right
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 20, height, { isStatic: true }),

];
World.add(world, wall);

const grid = Array(cellRow).fill(null).map(() => Array(cellCol).fill(false));
const vertical = Array(cellRow).fill(null).map(() => Array(cellCol - 1).fill(false));
const horizontal = Array(cellRow - 1).fill(null).map(() => Array(cellCol).fill(false));


const startRow = Math.floor(Math.random() * cellRow);
const startCol = Math.floor(Math.random() * cellCol);

const shuffle = (arr) => {

    let counter = arr.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);

        counter--;
        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}


const recursive = (row, col) => {
    if (grid[row][col]) {
        return;
    }

    grid[row][col] = true;

    const neighbors = shuffle([
        [row - 1, col, 'up'],
        [row, col + 1, 'right'],
        [row + 1, col, 'down'],
        [row, col - 1, 'left'],
    ]);

    //for each neighbor
    for (let neighbor of neighbors) {

        const [nextRow, nextCol, direction] = neighbor;
        if (nextRow >= cellRow || nextRow < 0 || nextCol >= cellCol || nextCol < 0) {
            continue;
        }
        if (grid[nextRow][nextCol]) {
            continue;
        }

        switch (direction) {
            case 'left':
                vertical[row][col - 1] = true
                break;
            case 'right':
                vertical[row][col] = true
                break;
            case 'up':
                horizontal[row - 1][col] = true
                break;
            case 'down':
                horizontal[row][col] = true
                break;
        }

        recursive(nextRow, nextCol);
    }
    // end for

}

recursive(startRow, startCol);



horizontal.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if (open) return;
        const wall = Bodies.rectangle(
            colIndex * unitX + unitX / 2,
            rowIndex * unitY + unitY,
            unitX,
            10,
            { isStatic: true ,label:'wall'}
        );

        World.add(world, wall);
   

    })
});

vertical.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if (open) return;
        const wall = Bodies.rectangle(
            colIndex * unitX + unitX,
            rowIndex * unitY + unitY / 2,
            10,
            unitY,
            { isStatic: true ,label:'wall'}
        );

        World.add(world, wall);
        
    })
});

grid.forEach((el)=>{
    console.log(el);
    
})


// goal
const goal = Bodies.rectangle(width - unitX / 2, height - unitY / 2, unitX * .7, unitY * .7, { isStatic: true ,label:'goal'});
World.add(world, goal);

// ball
let radius=Math.min(unitX,unitY)/4;
const ball = Bodies.circle(unitX / 2, unitY / 2, radius,{label:'ball'});
World.add(world, ball);


document.addEventListener('keydown', event => {
    const {x,y}=ball.velocity;

    
    switch (event.keyCode) {
        case 38:
            Body.setVelocity(ball,{x,y:y-5});
            break;
        case 39:
            Body.setVelocity(ball,{x:x+5,y:y});
            break;
        case 40:
            Body.setVelocity(ball,{x,y:y+5});
            break;

        case 37:
            Body.setVelocity(ball,{x:x-5,y});
            break;
    }
})

// win 
Events.on(engine,'collisionStart',event=>{
   event.pairs.forEach((collision)=>{
       let labels=['goal','ball'];
           if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
               world.gravity.y=1;
               document.querySelector('.win').classList.remove('hidde');
              
               world.bodies.forEach((body,index)=>{
                  if (body.label==='wall') {
                      Body.setStatic(body,false)
                  }
               
               })
               
               
           }
   })
    
})
























// const wall=[
//     //up and down
//     Bodies.rectangle(height/2,0,height,50,{isStatic:true}),
//     Bodies.rectangle(height/2,width,height,50,{isStatic:true}),

//     //left and right
//     Bodies.rectangle(0,width/2,50,height,{isStatic:true}),
//     Bodies.rectangle(height,width/2,50,height,{isStatic:true}),

// ];
// World.add(world, wall);
// for (let index = 1; index < 10; index++) {
//     if (Math.random() > 0.5) {
//         World.add(world, Bodies.rectangle(Math.random()*width, Math.random()*height, 50, 50));
//     }
//     else{
//         World.add(world, Bodies.circle(Math.random()*width, Math.random()*height, 50));
//     }

// }





