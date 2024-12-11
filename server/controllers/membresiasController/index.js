const MembresiaModel = require("../../models/membresia/index");
const UsuarioModel = require("../../models/usuario/index");


const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const { SEED } = require("../../config/env");
const moment = require('moment-timezone');
const Stripe = require('stripe');
// const stripe = Stripe('sk_test_51QSNhD02EGPKdH1OHuAR3v2wkg66LJIao7UugYQXyttsSWqU3WoPnan8hOrE7PKPH2XlP8WS5AL4CYoTLiNTChDW00iTgasaJP'); 
const stripe = require('stripe')('sk_test_51QSNhD02EGPKdH1OHuAR3v2wkg66LJIao7UugYQXyttsSWqU3WoPnan8hOrE7PKPH2XlP8WS5AL4CYoTLiNTChDW00iTgasaJP'); // Reemplaza con tu clave secreta de Stripe


class MembresiasController {
  constructor() { }

  registro = async (req, res) => {

    const body = req.body;
    const vendedor = req.params.vendedor;
    const id = new mongoose.Types.ObjectId();

    const meses_membresia = body.meses;
    const fecha_creacion = moment().tz("America/Mexico_City").toDate();
    const fecha_fin = moment(fecha_creacion).add(meses_membresia, 'months').toDate();

   var membresia_id = ""

    var precio = 0;

    if(body.membresia == 1){
       precio = 540;
    } else if (body.membresia == 2) {
      precio = 1200;
    } else if (body.membresia == 3)  {
      precio = 3000;
    } else {
       precio == 5250
    }

    var precio_final = 0;
    
     if(meses_membresia == 3){
       precio_final = precio - (precio*10)/100;
     } else if (meses_membresia == 6){
       precio_final = precio * 2 - (precio*20)/100;
     } else {
       precio_final = precio * 4 - (precio*40)/100;
     }

    //  VALIDAR MESES Y MEMBRESIA
    if(body.membresia == 1){
        if(meses_membresia == 3){
          membresia_id = "price_1QUFIU02EGPKdH1OPHig5mMC";
        } else if(meses_membresia == 6){
          membresia_id = "price_1QUFKW02EGPKdH1OlcSdhIK6";
        } else {
          membresia_id = "price_1QUFLC02EGPKdH1OLtrP8Cnz";
        }
    }


        // Crear un checkout session en Stripe para una suscripción
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price: membresia_id,  // Este es el ID del precio que has creado en Stripe (un producto o plan)
              quantity: 1,
            },
          ],
          mode: 'subscription',  // Asegúrate de que el modo sea "subscription"
          success_url: 'http://localhost:3000/vendedores/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:3000/vendedores/cancel',
        });



        // try {
        //   const productos = await stripe.products.list({
        //     active: true,
        //   });
        //   console.log(productos); // Esto mostrará los precios asociados al producto
        //    return res.json({
        //      ok: true,
        //      productos
        //      // id: session.id
        //    })
        // } catch (error) {
        //   console.error("Error al obtener precios:", error);
        // }

    // const data = new MembresiaModel({
    //   _id: id.toString(),
    //   vendedor: vendedor,
    //   membresia: body.membresia,
    //   precio: precio_final,
    //   metodo_pago: body.metodo_pago,
    //   fecha_creacion: moment().tz("America/Mexico_City").toDate(),
    //   fecha_inicio: moment().tz("America/Mexico_City").toDate(),
    //   fecha_fin: fecha_fin,
    //  })

    try {
      // await data.save();

      return res.json({
        ok: true,
        id: session.id
      })
    } catch (error) {
      console.log(error)
    }
  }

  success = async (req, res) => {
    const session_id = req.params.session_id;
    const membresia_caruzzo = req.params.membresia_caruzzo;
    const meses_caruzzo = req.params.meses_caruzzo;
    const vendedor = req.params.vendedor;
  
    if (!session_id) {
      console.error('session_id no recibido en el backend.');
      return res.status(400).json({ ok: false, message: 'session_id es requerido.' });
    }
  
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
  
      if (session.payment_status === 'paid') {
        const id = new mongoose.Types.ObjectId();
        const meses_membresia = meses_caruzzo;
        const fecha_creacion = moment().tz("America/Mexico_City").toDate();
        const fecha_fin = moment(fecha_creacion).add(meses_membresia, 'months').toDate();

            const data = new MembresiaModel({
               _id: id.toString(),
               vendedor: vendedor,
               membresia: membresia_caruzzo,
               precio: session.amount_subtotal,
               id_pago: session.id,
               invoice: session.invoice,
               metodo_pago: 'STRIPE',
               fecha_creacion: moment().tz("America/Mexico_City").toDate(),
               fecha_inicio: moment().tz("America/Mexico_City").toDate(),
               fecha_fin: fecha_fin,
              })

            try {

              await data.save();

                  let data_usuario = {
                    membresia: membresia_caruzzo,
                    inicio_membresia: moment().tz("America/Mexico_City").toDate(),
                    fin_membresia: fecha_fin,
                  };
          
                 try {
                   await UsuarioModel.findByIdAndUpdate(vendedor, data_usuario);
                 } catch (error) {
                   console.log(error);
                 }
            
               return res.json({
                 ok: true,
               });
            } catch (error) {
              console.log(error);
              
              return res.json({
                ok: false,
              });
            }           
      } else {
        return res.json({
          ok: false,
          message: 'El pago no fue exitoso.',
        });
      }
    } catch (error) {
      console.error('Error al validar el pago:', error);
      return res.status(500).json({
        ok: false,
        message: 'Error al validar el pago.',
      });
    }
  };
  

  actualizacion = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    let data = {
      nombre_lote: body.nombre_lote,
      nro_vehiculos: body.nro_vehiculos,
      direccion: body.direccion,
      url: body.url,
      telefono: body.telefono,
      tipo: body.tipo,
      estado: body.estado,
    }

    try {
      await MembresiaModel.findByIdAndUpdate(id, data);
    } catch (error) {
      console.log(error)
    }

    res.json({ ok: true });
  }

  obtenerLote = async (req, res) => {
    
    const id = req.params.id;

    const lotesBD = await MembresiaModel.findById(id);

    res.json({ ok: true, lote: lotesBD });

  }

  obtenerLotesVendedor = async (req, res) => {
    
    const usuario = req.params.usuario;
    try {

      const lotesBD = await MembresiaModel.find({ usuario });
  
      if (!lotesBD || lotesBD.length === 0) {
        return res.status(404).json({
          ok: false,
          message: 'No se encontraron lotes para este usuario',
        });
      }
  
      return res.json({
        ok: true,
        lotes: lotesBD,
      });
    } catch (error) {
      console.error('Error al obtener los lotes:', error);
      return res.status(500).json({
        ok: false,
        message: 'Error al buscar los lotes',
      });
    }
    
  };
  

  vehiculos = async (req, res) => {
		let find = {};
    const query = req.query;

		// if(req.usuario.rol === "EMPRESA"){
    //   find = { ...find, empresa: req.usuario.id };
    // }

    // if(req.usuario.rol === "ADMIN" && query.empresa){
    //   find = { ...find, empresa: query.empresa };
    // }

		const vehiculos = await MembresiaModel.find({});

		return res.json({
			ok: true,
			vehiculos,
		});
	};

  eliminar = async (req, res) => {
    const id = req.params.id;

		try {
			await MembresiaModel.findByIdAndDelete(id);
		} catch (error) {
      console.log(error)
    }

		res.json({
			ok: true
		});
  }
}

module.exports = new MembresiasController();
