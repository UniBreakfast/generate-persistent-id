// This file is just an example of how to use the IdMaster class. It can be used for testing purposes or deleted.

const { IdMaster } = require('./id-master.js');

globalThis.commonIdMaster = new IdMaster('common');

const id1 = commonIdMaster.getId();
const id2 = commonIdMaster.getId();
const id3 = commonIdMaster.getId();

console.log({ id1, id2, id3 });

setInterval(() => {}, 1e6);
