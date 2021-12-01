import React, { useEffect, useState } from "react";
import {
  detailProducts,
  shoppingCart,
  getReview
} from "../../Redux/Actions/index.jsx";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Modal } from "@material-ui/core";
import "./detail.css";
import Rating from "@mui/material/Rating";

export default function Detail(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const detail = useSelector(state => state.detail);
  const reseña = useSelector(state => state.review);
  console.log(reseña, "RESEÑAAA")
  console.log(detail, "DETALLEEEE")

  useEffect(() => {
    dispatch(detailProducts(props.match.params.id));
    setTimeout(() => {
      dispatch(getReview({productId:props.match.params.id}));     
    }, 1000);
  }, [dispatch, props.match.params.id]);
  console.log(props.match.params.id, "ale querido")

  const cart = useSelector(state => state.shoppingCart);
  let total = 0;
  let suma = cart.map(el => Number(el.salePrice));
  for (let i of suma) total += i;

  if (reseña.length) {
    const puntuacionGeneral = reseña.map(el => el.score);
    let cantidadReseñas = puntuacionGeneral.length
    function promedio() {
      let suma = puntuacionGeneral.reduce(function (valorAnterior, valorActual) {
        return valorAnterior + valorActual;
      });
      let redondeo = suma / cantidadReseñas
      return redondeo.toFixed(1)
    }
    var average1 = promedio();
  }

  function handleButtonHome(e) {
    e.preventDefault();
    history.push("/home");
  }

  const [modal1, setModal1] = useState(false);

  const openCloseModal1 = () => {
    setModal1(!modal1);
  };
  const dispatchCart = () => {
    dispatch(shoppingCart(props.match.params.id));
  };

  function handleButtonCart(e) {
    e.preventDefault();
    history.push(`/carrito/` + props.match.params.id);
  }

  const [hover] = React.useState(-1);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const carrito = (
    <div className='detailContainer'>
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          <h3 className='carritoTitle'>Añadido al carrito correctamente</h3>
        </Typography>
        <div className='carritoDiv'>
          {detail?.map(products => {
            console.log(detail);
            return (
              <div>
                <h4>{products.productName}</h4>
                <ul className='detailUl'>
                  <li>{products.collection.name}</li>
                  <br></br>
                  <img alt="k" className='img' src={products.images} />
                  <br></br>
                  <br></br>
                  <li>{"$ " + Number(products.salePrice)}</li>
                </ul>
              </div>
            );
          })}
          <div className='carritoTotal'>
            <h4>TU CARRITO</h4>
            <h4>
              TOTAL ({cart.length} {cart.length === 1 ? "PRODUCTO" : "PRODUCTOS"} ): $ {total}
            </h4>
          </div>
        </div>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          <Link to={"/home"}>
            <button className='btn1'>Seguir comprando</button>
          </Link>
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          <button className='btn2' onClick={handleButtonCart}>
            Ver carrito
          </button>
        </Typography>
      </Box>
    </div>
  );

  const stock = []
  let stock1 = detail?.map(products => products.stock);
  for (let i = 1; i <= stock1; i++) {
    stock.push(i);
  }

  return (
    <div className='container'>
      {detail.map(products => {
        return (
          <div className='detailContainer'>
            <h1>{products.productName}</h1>
            <ul className='detailUl'>
              <li>{products.collection.name}</li>
              <br></br>
              <li>{products.gender}</li>
              <br></br>
              <img alt="k" className='img' src={products.images} />
              <br></br>
              <br></br>
              <li className='detailSummary'>{products.description}</li>
              <br></br>
              <li>{Number(products.salePrice) + "$"}</li>
            </ul>
            <div>
              <button type='button' onClick={() => openCloseModal1(dispatchCart())} className='btn2'>
                Agregar al carrito
              </button>
              <div>
                <Modal open={modal1} onClose={openCloseModal1}>
                  {carrito}
                </Modal>
              </div>
            </div>
          </div>
        );
      })}
      <div className='detailContainer'>
        <h1>Valoraciones y reseñas</h1>
        {reseña === undefined || reseña.length === 0 ? (
          <h4>No hay reseñas</h4>
        ) : (
          reseña.map(product => {
            return (
              <div>
                <h4>Reseña: {product.review}</h4>
                <Rating name='score' defaultValue={product.score} precision={1} readOnly />
                
              </div>
            );
          })
        )}
        <h3>Puntuacion general</h3>
        <Box
          sx={{
            width: 200,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Rating name="half-rating-read" value={average1} precision={0.5} readOnly />
          <h4>{average1}</h4>
        </Box>
        </div>
      <button onClick={handleButtonHome} className='btn'>
        Home
      </button>
      <br></br>
    </div>
  );
}
