# justworks-takehome

Luis Croussett | [ljcroussett@gmail.com][email-ref] | [linkedIn][linkedin-ref] | [resume][resume-ref]

[email-ref]: mailto:ljcroussett@gmail.com
[linkedin-ref]: https://www.linkedin.com/in/luiscroussett/
[resume-ref]: https://drive.google.com/file/d/1Aum4vK_ROVSc1tCgKa7Gnn5d_BmCraSh/view?usp=sharing


<a id="top"></a>
## Table of content: 📖
- [Installation](#item-one)
- [Files and design decisions](#item-two)
- [Features](#item-three)
- [Testing](#item-four)

<br>

---
<a id="item-one"></a>
<br> 

## Installation :computer:  
[back to the top 🔝](#top)  
<br>  

``` bash
git clone
cd justworks-takehome
npm install --legacy-peer-deps
npm test
```

<br>

---

<a id="item-two"></a>

## Files and design decisions:
[back to the top 🔝](#top)  
<br>

* constants.js    --> Contains configurations and messages presented on the UI. This information, or parts of it, ideally would be on a CDN, or at the very least as env variables, that way when changing configs and application copy a full application deployment wouldn't be needed. This file is imported and used on both the application and the tests, that way there is a single place where information is retrieved avoiding double works and potentially missing needed changes that could break tests or the application. This also makes tests more deterministic.

* helpers.js  --> Contains helper functions used to make convertions from USD to BTC and ETH, and viceversa. 

* mockDat.js --> Contatains mock data needed to mock API calls, initial state...etc. 

* reducers.js --> contains the reducer funtions used to calculate the new state based on application functionality and user application interactions. 

* validators.js --> Contains validator logic, in this case for the inputs, in order to validate that only numeric values following proper number formats are accepted.

<br>

### *__Libraries and packages used:__*

* Chakra UI is used for UI components - [Chakra UI website and docs][chakra-ui]

[chakra-ui]: https://chakra-ui.com/



---

<br>
<a id="item-three"></a>

## Features  🧑‍💻
[back to the top 🔝](#top)  
<br>

* Banner that inform the status of the fetch request used to retrieve the rates data from the coinbase API. If there is an error while retrieving the rates information, the inputs are disabled in order to prevent calculations to be performed when there is no rates data.  

* Input values are validated in order to determine if the inputs are being set to proper values that can be used to successfully perform the conversion calculation.  

* When an invalid input value is set, a validation error banner is rendered onto the screen, and the inputs value are set to "unable to calculate". When user clicks (focus on) an input with an "unable to calculate" value, all inputs are automatically cleared for a better user experience. Potentially, a history feature could be created in order to allow users to go back a a previously successful calculations.  

* Rates allocation percentage and text is stored and retreived from the constants json in order to allow for easy changes, if needed. This would potentially be on a CDN to prevent application deployments when changing configs.  

<br> 

---

<br>
<a id="item-four"></a>

## Testing 🧑‍🔬
[back to the top 🔝](#top)  
<br>
```basg
npm test
```

### *__Use cases:__*
* Fetch status banner: A status banner should come up as the application is fetching the USD conversion data.
  * _Warning banner:_ Warning banner shows while awaiting fetching response 
  * _Error banner:_  Error banner shows when rates fetch request fails and input fields should be disabled as their is no rates data to perform conversations  
  * _Success banner:_ Success banner shows when request is successful.
* Input box validation:
  * _Unable to calculate error:_ If input validation fails, in this case if the input value does not follow a proper numeric pattern "xxx" or "xxx.xx", the input fields are populated with a "unabel to calculate message".
  * _Reset input boxes:_  Input boxes value and status should be reset on focus when "unable to calcualte" is present. 
* Rate calculation on inputs:
  * From USD to BTC and ETH:
  * From BTC to USD and ETH:
  * From ETH to USD and BTC:  
<br/>
### *__Testing tooling:__*

* *_reducer testing:_* [_Jest_][jest-url]
* *_react component testing:_* [_react-testing-library_][rtl-url]
* *_api mocking:_* [_Mock Server Worker_][msw-url]

  
[jest-url]: https://www.npmjs.com/package/jest
[rtl-url]: https://www.npmjs.com/package/@testing-library/react
[msw-url]: https://www.npmjs.com/package/msw

<br/>

