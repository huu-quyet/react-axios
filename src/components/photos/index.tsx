import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { fetchData } from '../axios';
import { IPhoto } from '../config/interface';
import ErrorHandle from '../custom-error';

const styled = makeStyles({
  form: {
    display: 'flex',
    alignItems: ' center',
    marginTop: '1rem',
    gap: 14,

    '& select': {
      fontSize: '1.2rem',
    },

    '& input': {
      fontSize: '1rem',
      width: '20%',
    },

    '& input, & select': {
      padding: '0.4rem 0.8rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#212529',
      backgroundColor: '#fff',
      border: '1px solid#ced4da',
      borderRadius: '0.25rem',
      transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',

      '&:focus': {
        color: '#212529',
        backgroundColor: '#fff',
        borderColor: '#86b7fe',
        outline: 0,
        boxShadow: '0 0 0 0.25rem rgb(13 110 253 / 25%)',
      },
    },
  },

  cardTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

let typeSearch = 'Album Id';
const numberAlbum = 12;

const Photos: React.FC<any> = () => {
  const classes = styled();
  const [photos, setPhotos] = useState([]);
  const [searchedPhotos, setSearchPhoto] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`photos`);
        if (response.statusText !== 'OK') return;
        setPhotos(response.data);
        setIsSearch(false);
        setIsLoading(false);
        setError(false);
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    })();
  }, []);

  //Handle load more photo
  const onLoadMoreHandler = () => {
    setCount(count + 1);
  };

  // Change type of search
  const onChangeTypeSearch = (event: any) => {
    typeSearch = event.target.value;
  };

  // Handle search
  const onSearchAlbum = (event: any) => {
    event.preventDefault();
    if (!searchRef.current?.value) return;
    const id = +searchRef.current?.value;

    switch (typeSearch) {
      case 'Album Id': {
        const searchedPhotos = photos.filter((photo: IPhoto) => {
          return photo.albumId === id;
        });
        setCount(0);
        setIsSearch(true);
        setSearchPhoto(searchedPhotos);
        break;
      }

      case 'Image Id': {
        const searchedPhotos = photos.filter((photo: IPhoto) => {
          return photo.id === id;
        });
        setCount(0);
        setIsSearch(true);
        setSearchPhoto(searchedPhotos);
        break;
      }
      default: {
      }
    }
  };

  const isLoadMore = !isSearch
    ? photos.length - count * numberAlbum > numberAlbum
    : searchedPhotos.length - count * numberAlbum > numberAlbum;

  const isError = isSearch && searchedPhotos.length === 0;

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: '0 6rem' }}>
        <Typography
          sx={{ marginTop: '2rem', fontSize: '2rem', fontWeight: '700' }}
        >
          Photos
        </Typography>
        <Box sx={{ marginBottom: '1rem' }}>
          <form onSubmit={onSearchAlbum} className={classes.form}>
            <select onChange={onChangeTypeSearch}>
              <option>Album Id</option>
              <option>Image Id</option>
            </select>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by album id or image id"
            />
            <Button type="submit" color="primary" variant="contained">
              Search
            </Button>
          </form>
        </Box>
        {isError && typeSearch === 'Album Id' ? (
          <ErrorHandle message="Not found!!! Id album only from 1 to 100" />
        ) : (
          ''
        )}
        {isError && typeSearch === 'Image Id' ? (
          <ErrorHandle message="Not found!!! Id image only from 1 to 5000" />
        ) : (
          ''
        )}
        {error && <ErrorHandle message="Not found!!!" />}
        {isLoading && (
          <Typography fontSize="2rem" sx={{ textAlign: 'center' }}>
            Loading...
          </Typography>
        )}
        <Grid container spacing={3}>
          {(isSearch ? searchedPhotos : photos)
            .slice(0, numberAlbum * (count + 1))
            .map((photo: IPhoto, index) => {
              return (
                <Grid key={index} item xs={6} md={3}>
                  <Card sx={{ maxWidth: '100%' }}>
                    <CardMedia
                      component="img"
                      alt={photo.title}
                      image={photo.url}
                      height="300"
                      width="100%"
                    />
                    <CardContent>
                      <Typography
                        className={classes.cardTitle}
                        fontWeight="700"
                      >
                        {photo.title}
                      </Typography>
                      <Typography m="0.6rem 0">Id: #{photo.id}</Typography>
                      <Typography>Album Id: #{photo.albumId}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          {isLoadMore && (
            <Button
              sx={{
                margin: '1rem 0',
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%,0)',
              }}
              variant="contained"
              color="primary"
              onClick={onLoadMoreHandler}
            >
              Load More
            </Button>
          )}
        </Grid>
      </Box>
    </Container>
  );
};
export default Photos;
