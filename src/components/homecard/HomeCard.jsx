import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import img from '../../allPages/CourseException/stuffs/img.png'
import './homeCard.css'

const HomeCard = (props) => {
  return (
    <div className='homeCardMain'>
        <Card className='homeCard' sx={{
          backgroundColor: "var(--background)",
          border:"1px solid var(--Bordercolor)",
          borderRadius:"5px",
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
          '&:hover': {
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            backgroundColor:"var(--background)"
          },
        }}>
          <CardActionArea>
            <CardMedia borderRadius="5px" component="img" height="180" image={props.image}/>
            <CardContent>
              <div className='cardTit'>
              {props.title}
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
    </div>
  )
}

export default HomeCard