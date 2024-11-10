import { Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import data from "../../cakeData"
import { useStateContext } from "../../context/StateContextProvider"
import styles from "./Cakes.module.scss"
import { AnimatePresence, motion } from "framer-motion"
import { easeAnimate } from "../../animations/animation"
import axios from "axios"

const CakeList = () => {
    const { formatPrice, scrollToTop, cakeRef } = useStateContext();
    const [cakes, setCakes] = useState([]);
    const backendURL = 'http://26.170.181.245:8080'

    const fetchProducts = async() => {
        try {
            const response = await axios.get(`${backendURL}/api/products`)
            if (response.status === 200){
                setCakes(response.data.content)
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchProducts()
    },[])

    return (
        <div>
        <section ref={cakeRef} id="cakes-section" className={styles.cakesMenu}>
            <div className={styles.cakesWrapper}>
                <h2>Our Cakes</h2>
                {/* <div className={styles.cakeCategory}>
                    { categoryList.map((category, index) =>  <span key={index} className={cakeCategory === category ? `${styles.activeCategory}` : null } onClick={handleCakecCategory}>{category}</span> ) }
                </div> */}
                <div className={styles.dividerLine}></div>
                
            </div>

            
               
        </section>
        <div className={styles.listProducts}>
            {
                cakes.map((item) => (
                    <Link to={`/cake/${item.id}`}>
                    <div key={item.id}>
                        <img className={styles.cakeImage} src={item.images} alt="" />
                            <p className={styles.namePriceProducts}>{item.name}</p>
                            <p className={styles.namePriceProducts}>{item.price} vnđ</p>
                    </div>
                    
                    </Link>
                ))
            }
        </div>
        </div>

        
    )
}

export default CakeList