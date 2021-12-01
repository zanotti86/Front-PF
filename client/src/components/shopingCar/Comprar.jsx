import "./shopingCart.css";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import {checkoutProducts} from "../../Redux/Actions/index"
import { useHistory } from "react-router-dom";

export default function Comprar() {
  const dispatch = useDispatch()
  const history = useHistory();
  const total = useSelector((state) => state.totalCompra);
  const shopping = useSelector((state) => state.ShoppingAlmacen);
  const logIn = useSelector((state) => state.userLogin);
  let idUser = logIn.id;
  
   let totalCompra= []

   console.log(total, "totaol")
   console.log(shopping, "Shopping")
  
  if(idUser){
    let idTotalCompra = total.map((el) => el.productId)
    let idShopping = shopping.map((el) => el.productId)
    for(let  i = 0; i < idTotalCompra.length ; i++){
      for(let j=0; j < idShopping.length; j++){
        if(idTotalCompra[i] === idShopping[j]){
          totalCompra.push(total[i])
          

        }
      }
    }
  }


  const { loginWithRedirect } = useAuth0();
  function handleClick (e){
    e.preventDefault()
    setTimeout(() => {
      dispatch(checkoutProducts(totalCompra))
      history.push("/pago")
    }, 1000)
    console.log(totalCompra, "total")
  }



  return (
    <div>
      {idUser ? (
        <>
          <div>
            <Box>
                <Button onClick={(e) => handleClick(e)}>IR A COMPRAR</Button>
            </Box>
          </div>

          <div>
            <Link to="/home">
              <button className="botonCart1">volver</button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div>
            <Box>
              <Button onClick={() => loginWithRedirect()}>Logearte</Button>
            </Box>
          </div>
          <div>
            <Link to="/home">
              <button className="botonCart1">volver</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
