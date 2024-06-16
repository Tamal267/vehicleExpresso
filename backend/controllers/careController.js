const oracledb = require('oracledb')
const {getDaysInMonth, ReversemonthMap, monthMap}  = require('../monthTonum')
const {runQuery,runQueryOutBinds}=require('../connection')


const pieData = async(req, res)=>{
    try{
        let count =[];
        let d=[];
        const {year,month} = req.body;
        console.log(req.body);
        if(!month || month=="ALL"){
            d[0] = await runQuery(
            `select count(c.SERVICE_ID) AS "Only Basic"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Basic'`,{year});

            d[1] = await runQuery(
            `select count(c.SERVICE_ID) AS "Basic & Premium"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Premium'`,{year});

            d[2] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Repair"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.REPAIR.type is not null`,{year});

            d[3] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Wash"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.WASH.type is not null`,{year});   
            
            for(let i=0;i<4;++i)count.push(d[i][0]);
        }
        else{
            d[0] = await runQuery(
            `select count(c.SERVICE_ID) AS "Only Basic"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Basic'`,{month,year});
    
            d[1] = await runQuery(
            `select count(c.SERVICE_ID) AS "Basic & Premium"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Premium'`,{month,year});
    
            d[2] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Repair"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.REPAIR.type is not null`,{month,year});
    
            d[3] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Wash"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.WASH.type is not null`,{month,year});   
                
            for(let i=0;i<4;++i)count.push(d[i][0]);
        }
        res.status(200).json({
            "slicedata": count
        });
    }catch(err){
        console.error(err);
        res.status(500).send('Error quering the Piedata');
    }
}


const lineData = async(req,res)=>{
    try{
        const {year,month} = req.body;
        let months=[];
        let days=[];
        if(month=="ALL" || !month){
            for(let mon=1;mon<=12;++mon){
                const data=await runQuery(
                `SELECT SUM(c.SERVICING_COST) AS "${ReversemonthMap[mon]}"
                FROM CARE_TRANSAC c,TAKES_CARE t WHERE 
                EXTRACT(MONTH FROM t.SERVICE_DATE)=:mon AND 
                EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND
                c.SERVICE_ID=t.SERVICE_ID`,{mon,year});
                if(data[0][ReversemonthMap[mon]]!==null) months.push(data[0]);
                else months.push({[ReversemonthMap[mon]]: 0});  
            }
            res.status(200).json({
                "monthCost": months
            }); 
        }
        else{
            const total=getDaysInMonth(monthMap[month], year);
            for(let day=1;day<=total;++day){
                const data=await runQuery(
                `SELECT SUM(c.SERVICING_COST) AS "Day ${day}"
                FROM CARE_TRANSAC c,TAKES_CARE t WHERE 
                EXTRACT(DAY FROM t.SERVICE_DATE)=:day AND
                to_char(t.SERVICE_DATE,'MON')=:month AND 
                EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
                c.SERVICE_ID=t.SERVICE_ID`,{day,month,year});
                if(data[0][`Day ${day}`]!==null) days.push(data[0]);
                else days.push({[`Day ${day}`]:0});  
            }
            res.status(200).json({
                "dayCost": days
            }); 
        }
    }catch(err){
        console.error(err);
        res.status(500).send('Error quering the Line data');
    }
}

const serviceUser = async(req,res)=>{
    let {
        vehicleno,
        vehicleowner,
        vehicletype,
        vehiclemodel,
        vehiclecompany,
        vehiclecolor,
        date,
        repairtype,
        washtype}=req.body;

        vehicleno = vehicleno.toUpperCase();
        vehicletype = vehicletype.toUpperCase();
        vehiclecompany = vehiclecompany.toUpperCase();
        vehiclemodel = vehiclemodel.toUpperCase();
        vehiclecolor = vehiclecolor.toUpperCase();
    try{
        const exists=await runQuery(
        `select * from vehicle_info 
        where VEHICLENO = :vehicleno`,{vehicleno});

        if(exists.length===0){
            await runQuery(`insert into vehicle_info (VEHICLENO, VEHICLE_OWNER, VEHICLETYPE, VEHICLE_MODEL, VEHICLE_COMPANY, VEHICLE_COLOR)
            values(:vehicleno,:vehicleowner,:vehicletype,:vehiclemodel,:vehiclecompany,:vehiclecolor)`,
            {   vehicleno,
                vehicleowner,
                vehicletype,
                vehiclemodel,
                vehiclecompany,
                vehiclecolor,
            });
            console.log('Successful Insertion in vehicle info!!');
        }else{
            console.log('Already exists!!');
        }

        const data=await runQueryOutBinds(`insert into care_transac (MECHANIC_NAME,SERVICE_TYPE,SERVICING_COST)
        values('Not Selected','shortterm',0)
        returning SERVICE_ID INTO :service_id`,
        {
                service_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        });
        console.log('Successful Insertion in care_transac!!');

        const serviceid=data.service_id[0];
        await runQuery(`insert into Shorttermcare (SHORTTERM_ID,LABOR_HOURS,REPAIR,WASH,COMPLETED)
        values(:serviceid,0,SHORT_CARE(:repairtype,0),SHORT_CARE(:washtype,0),'NO')`,
        {   
            serviceid,
            repairtype,
            washtype
        });
        console.log('Successful Insertion in shorttermcare!!');
        const service_date=date;
        await runQuery(`INSERT INTO takes_care (SERVICE_ID, VEHICLENO,SERVICE_DATE)
        VALUES (:serviceid, :vehicleno, TO_DATE(:service_date,'yyyy-mm-dd'))`,
        {   
            serviceid,
            vehicleno,
            service_date
        });
        console.log('Successful Insertion in takes_care!!');

        res.status(200).json({"service_id": data.service_id[0]});

    }catch(err){
        console.error(err);
        res.status(500).send('Error inserting the data');
    }
}


module.exports={
    pieData,
    lineData,
    serviceUser
}

