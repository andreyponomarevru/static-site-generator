doctype html
html(lang='en' class='page')
    meta(charset='utf-8')
    meta(http-equiv='x-ua-compatible' content='ie=edge')
    meta(name='viewport' content='width=device-width, initial-scale=1.0, viewport-fit=cover')
    meta(name='description' content='Description of the page less than 150 characters')
    
    //- Displayed in Google search results
    meta(name='keywords' content='web development, web applications, frontend')
    meta(name='author' content='Andrey Ponomarev')

    //- 32x32px 
    link(rel='shortcut icon' href='./img/favicon.ico' type='image/x-icon') 

    link(rel='icon' href='./img/icon.png' type='image/png')
    //- Apple Touch Icon (at least 200x200px)
    link(rel='apple-touch-icon' href='./img/custom-icon.png')
    
    title Andrey Ponomarev. Portfolio
  
    body(class='page__body page__preload')
      
      //- div(class='page__page-layout') - helper class (wrapper), enable if needed
      include ../page-header/page-header.pug
      include ../page-main/page-main.pug
      include ../page-footer/page-footer.pug
