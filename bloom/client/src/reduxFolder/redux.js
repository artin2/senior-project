import {userLoginSuccess, userLoginFailure} from './actions/user';

// function fetchProducts() {
//     return dispatch => {
//         dispatch(fetchProductsPending());
//         fetch('https://exampleapi.com/products')
//         .then(res => res.json())
//         .then(res => {
//             if(res.error) {
//                 throw(res.error);
//             }
//             dispatch(fetchProductsSuccess(res.products);
//             return res.products;
//         })
//         .catch(error => {
//             dispatch(fetchProductsError(error));
//         })
//     }
// }


function login(email, password, auth_token) {

    console.log("here?", email, password);

    return dispatch => {
     fetch('http://localhost:8081/login' , {
          headers: {
            'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: "POST",
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    })

    .then(res => res.json())
        .then(res => {
            
            if(res.error) {
                throw(res.error);
            }
            console.log("Successful login!", res)
            dispatch(userLoginSuccess(email, auth_token));
            return res;
        })
        .catch(error => {
            console.log("Error!", error)
            dispatch(userLoginFailure(error));
        })
    }
}

//     .then(function(res){
//       console.log(res);
//       if(res.status!==200){
//         console.log("Error!", res)
//         dispatch(userLoginFailure(res.error));
//         // dispatch(addAlert(response))
//       }
//       else{
//         // redirect to home page signed in
//         // const result = yield res.json();
//         console.log("Successful login!", res)
//         dispatch(userLoginSuccess(res));
//
//         console.log("passed");
//         //store state
//         // dispatch(userLogin(email, auth_token));
//
//         // self.setState({
//         //   returnedResponse: response
//         // })
//         // return response.json()
//       }
//     })
//     .then(data => {
//       // if(data){
//       //   self.triggerHome(data)
//       // }
//     })
//   }
// }

export default login
