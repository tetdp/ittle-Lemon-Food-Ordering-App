import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
    return db.execAsync(`create table if not exists menuitems (id integer primary key not null, name text, description text, price number, category text, imageFileName text);`);
}

export async function getMenuItems() {
    return db.getAllAsync(`select * from menuitems`)
}

// export async function saveMenuItems(menuItems) {
    
//     menuItems.forEach (function(item){
//         db.runAsync(`insert into menuitems (id, name, description, price, category, imageFileName) values(?,?,?,?,?,?)`
//             , item.id, item.name, item.description, item.price, item.category, item.imageFileName)
//     })
// }
export async function saveMenuItems(menuItems) {
    try {
      await db.execAsync(`insert into menuitems (uuid, title, price, category) values ` +
        menuItems
          .map(i => `('${i.id}','${i.title}','${i.price}','${i.category}')`).join(','));
  
    } catch(e) {
      console.error(`Error: ${e.message}`);
    }
  }

//filter function
export async function filterByQueryAndCategories(query, activeCategories) {
    return new Promise((resolve, reject) => {
      let sql = `select * from menuitems where category IN (${activeCategories.map(c => `'${c}'`).join(',')})`
      if (query.length > 0) {
        sql += ` AND title like '%${query}%'`;
      } 
      const results = db.getAllAsync(sql);
      resolve(results);
    });
  }