import PropTypes from "prop-types"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { memo } from "react";
import CardModal from "./CardModal";

const MediaCard = memo(({ id,title, author, genre, thumnail }) => {


    return (
      <Card sx={{ width: "250px",height:"350px",  borderRadius:"2vw/3vh"}}>
        <CardMedia
          component="img"
          sx={{ height: "30vh" }}
          alt={thumnail.slice(10,)}
          src={thumnail.slice(10,)}
          title="sin"
        />
        <CardContent sx={{height:"10vh"}}>
          <Typography gutterBottom variant="h6" component="div" fontSize={"18px"}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={"12px"} style={{float:"left"}}>
            작가 : {author}
          </Typography>
          <Typography variant='body2' color="text.secondary" fontSize={"12px"}>
            분류 : {genre}
          </Typography>
        </CardContent>
        <CardActions>
          <CardModal id = {id} />
        </CardActions>
      </Card>
    );
  });

MediaCard.propTypes = {
    id : PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
};

export default MediaCard;