const Telegraf = require("telegraf");

const bot = new Telegraf("918062756:AAGWTjxk-EuXddyA0PBP3SG_aieOHIqLqRY");

const axios = require('axios');

//Data store from gsheet
let dataStore = [];

//invoke getData function when script starts
getData();

bot.command('fact', ctx => {
  //get max row number
  let maxRow = dataStore.filter(item => {
    return (item.row == '1' && item.col == '2');
  })[0].val;
  //generate random number from 1 to max row
  let k = Math.floor(Math.random() * maxRow) + 1;
  //get fact object that matches row with randomly generated number
  let fact = dataStore.filter(item => {
    return (item.row == k && item.col == '5');
  })[0];
  //output message
  let message =
    `
Fact #${fact.row}:
${fact.val}
  `;
  //reply user
  ctx.reply(message);
})

bot.command('update', async ctx => {
  try {
    //update data
    await getData();
    ctx.reply('updated');
  } catch (err) {
    console.log(err);
    ctx.reply('Error encountered');
  }
})

async function getData() {
  try {
    //send http request to gs link to get information back in json format
    let res = await axios('https://spreadsheets.google.com/feeds/cells/1qwunC72mqNN2Vfy2tIiOrwpxOnHn3AnWmLfsf18llIA/1/public/full?alt=json');

    //store entry array into data variable
    let data = res.data.feed.entry;
    //make sure dataStore is empty
    dataStore = [];
    //process data into dataStore
    data.forEach(item => {
      dataStore.push({
        row: item.gs$cell.row,
        col: item.gs$cell.col,
        val: item.gs$cell.inputValue,
      })
    })
  } catch (err) {
    console.log(err);
    throw new Error;
  }
}

bot.launch();