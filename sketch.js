//Create variables here
var dog , happyDog , database  , foodStock;
var foodS = 0;
var fedTime , lastFed;
var foodObj;
var garden , bedroom , washroom;
var gameState = "Hungry";
var readState
function preload()
{
  img = loadImage("images/dogImg.png");
  img1 = loadImage("images/dogImg1.png");
	//load images here
  garden = loadImage("images/Garden.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
    dog = createSprite(250,250,50,50);
    dog.addImage(img);
    dog.scale = 0.5;
    foodStock = database.ref('Food');
    foodStock.on("value",readStock);
    feed=createButton("Feed the Dog");
    feed.position(850,95);
    feed.mousePressed(feedDog);

    addFood=createButton("Add Food");
    addFood.position(950 , 95);
    addFood.mousePressed(addFoods)

    foodObj = new Food()
readState = database.ref('gameState');
readState.on("value" , function(data){
  gameState = data.val();
})





}


function draw() {  
 background(46 , 139 , 87);

currentTime = hour();
if(currentTime==(lastFed+1)){
update("Playing");
foodObj.garden();
}else if (currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry")
  foodObj.display();
}

if(gameState!== "Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{addFood.show();
feed.show();
dog.addImage(img1)
}

 fedTime=database.ref('FeedTime');
 fedTime.on("value" , function(data){
lastFed=data.val();
 });
 fill(255,255,254);
 textSize(15);
if(lastFed>=12){
  text("Last Feed : "+ lastFed%12 + " PM" , 350 , 30);
}else if(lastFed ==0){
  text("last Feed : 12 AM" , 350 ,30);
}else{
  text("Last Feed : "+lastFed+" AM" , 350 , 30);
}
  drawSprites();
  
  //add styles here
textSize(25);
text("Food Available: " + foodS , 250 , 50 );

}

function addFoods(){
foodS++;
database.ref('/').update({
  Food:foodS
})
}
function feedDog(){
  dog.addImage(img1);
console.log()
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
    
  })
}
function update(state){
  database.ref("/").update({
gameState:state

  })
  
}
function readStock(data){
foodS = data.val();
foodObj.updateFoodStock(foodS);
}

/*function writeStock(x){
  database.ref('/').update({
    Food:x 
})
}*/
