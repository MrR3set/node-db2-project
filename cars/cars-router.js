const express = require("express");

const knex = require('knex');

const knexfile = require("../knexfile");
const db = knex(knexfile.development);

const router = express.Router();

router.get("/",(req,res)=>{
    db("cars").then(cars=>{
        res.status(200).json(cars);
    }).catch(err=>{
        res.status(500).json({msg:"err"});
    })
})
router.get("/:id",ValidateCarID,(req,res)=>{
    db.select("*").from("cars").where({"id":req.params.id})
    .then(cars=>{
        res.status(200).json(cars);
    }).catch(err=>{
        res.status(500).json({msg:"err"});
    })
})

router.post("/",ValidateCar,(req,res)=>{
    db("cars").insert(req.body).then(id=>{
        db.select("*").from("cars").where({"id":id[0]}).then(car=>{
             res.status(200).json(car);
        })
     }).catch(err=>{
         res.status(500).json({msg:"err"});
     })
})


router.patch("/:id",ValidateCarID,(req,res)=>{
    db("cars").where({"id":req.params.id})
    .update(req.body).then(id=>{
        db.select("*").from("cars").where({"id":req.params.id}).then(car=>{
            res.status(200).json(car);
       })
    }).catch(err=>{
        res.status(500).json({msg:"err"});
    })
})

router.put("/:id",ValidateCarID,ValidateCar,(req,res)=>{
    db("cars").where({"id":req.params.id})
    .update(req.body).then(id=>{
        db.select("*").from("cars").where({"id":req.params.id}).then(car=>{
            res.status(200).json(car);
       })
    }).catch(err=>{
        res.status(500).json({msg:"err"});
    })
})

router.delete("/:id",ValidateCarID,(req,res)=>{
    db("cars").where({"id":req.params.id})
    .delete().then(data=>{
        data?res.status(201).json({msg:"Deleted"}):null
    }).catch(err=>{
        console.log(err);
        res.status(500).json({msg:"err"});
    })
})

module.exports = router;

function ValidateCarID(req,res,next){
    db.select("*").from("cars").where({"id":req.params.id}).then(data=>{
        data.length>0?next():res.status(404).json({msg:"Not found"});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({msg:"err"});
    })
}
function ValidateCar(req,res,next){
    if(!req.body||!req.body.vin||!req.body.make||!req.body.model||!req.body.mileage){
        res.status(403).json({msg:"bad request"});
    }else
    next();
}