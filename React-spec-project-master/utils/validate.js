import { useRef, useEffect } from 'react';


export const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

export const validateName = (name) =>{
  

  return name.match(/^[a-zA-Z]+$/);


}

export function calculateImageText(path, lName, fName) {
  if (lName === '') {
    return (fName.substring(0, 2));
  }
  else {
    return (fName.substring(0, 1) + lName.substring(0, 1));
  }
}


export function getSectionListData(data) {
  let categories = [];
  data.forEach((item) => {
    categories.indexOf(item.category) === -1 ? categories.push(item.category) : []
  });

  let sections = [];

  data.forEach((item) => {
    sections.push({ id: item.id, name: item.name, description: item.description, price: item.price, category: item.category, imageFileName: item.imageFileName })
  });

  return sections;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
