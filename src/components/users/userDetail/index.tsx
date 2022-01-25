import { Button, Container, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteData, fetchData, postData, putData } from '../../axios';
import { IAlbum, IForm, IParam, IUser } from '../../config/interface';
import ErrorHandle from '../../custom-error';

const styled = makeStyles({
  container: {
    padding: '2rem 6rem',
    borderBottom: '1px solid #ddd',

    '@media screen and (max-width: 960px)': {
      padding: '2rem 1rem',
    },
  },
  box: {
    display: 'flex',
    '& :first-child': {
      marginRight: '2rem',
      width: '30%',
    },
    '& :nth-child(2)': {
      fontWeight: 700,
      width: '55%',
    },
  },

  form: {
    '& :first-child': {
      marginTop: '2rem',
    },

    '& label': {
      display: 'inline-block',
      marginBottom: '0.6rem',
    },

    '& input': {
      //   display: 'block',
      width: '100%',
      padding: '0.4rem 0.8rem',
      marginBottom: '1rem',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#212529',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      border: '1px solid#ced4da',
      appearance: 'none',
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

  style: {
    maxWidth: '50%',
    marginRight: '2rem',
  },

  boxPhotos: {
    display: 'flex',
    // alignItems: 'stretch',

    '& :first-child': {
      width: '5%',
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #ccc',
    },
    '& :nth-child(2)': {
      width: '80%',
      fontWeight: 700,
      padding: '0.5rem 1rem',
      borderTop: '1px solid #ccc',
      borderBottom: '1px solid #ccc',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    '& :nth-child(3)': {
      width: '10%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderTop: '1px solid #ccc',
      borderBottom: '1px solid #ccc',
      borderRight: '1px solid #ccc',

      '& button': {
        color: 'white',
        background: 'red',
        borderRadius: '8px',
        cursor: 'pointer',

        '&:hover': {
          opacity: '0.8',
        },

        '&:active, &:checked': {
          transform: 'scale(0.9)',
        },
      },
    },
  },
});

const initialUser: IUser = {
  address: {
    city: '',
    geo: {
      lat: '',
      lng: '',
    },
    street: '',
    suite: '',
    zipcode: '',
  },
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
  email: '',
  id: 0,
  name: '',
  phone: '',
  username: '',
  website: '',
};

const UserInfo: React.FC = () => {
  const classes = styled();
  const param: IParam = useParams();
  const [user, setUser] = useState(initialUser);
  const [errorUserInfo, setErrorUserInfo] = useState(false);
  const [albumsUser, setAlbumsUser] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [edit, setEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const newAlbum = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await Promise.all([
          fetchData(`users/${param.id}`),
          fetchData(`users/${param.id}/albums`),
        ]);

        if (response[0].statusText !== 'OK') {
          throw new Error('Something went wrong!');
        }

        setUser(response[0].data);
        setAlbumsUser(response[1].data);
        setErrorUserInfo(false);
      } catch (error: any) {
        setErrorUserInfo(true);
        setErrorMessage(`${error.message}`);
      }
    })();
  }, []);

  // Edit form
  const onEditHandle = () => {
    setEdit(true);
  };

  // Cancel Edit form
  const onCancelHandle = () => {
    setEdit(false);
  };

  // Reset default data form
  const onResetForm = (resetForm: any) => {
    resetForm();
  };

  const validate = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email not correct type'),
    phone: Yup.string().required('Phone is required'),
    website: Yup.string().required('Website is required'),
  });

  // Submit contact user
  const onSubmitForm = async (values: IForm, helper: any) => {
    const newUser = {
      ...user,
      email: values.email,
      phone: values.phone,
      website: values.website,
    };
    const statusPut = await putData(`users/${user.id}`, newUser);
    if (statusPut.statusText === 'OK') {
      setUser(newUser);
      setEdit(false);
    }
  };

  const validateOnChange = (values: any) => {
    const isChange =
      values.email === user.email &&
      values.phone === user.phone &&
      values.website === user.website;
    if (isChange) {
      setIsSubmit(false);
    } else setIsSubmit(true);
  };

  //Add new Album
  const onAddNewAlbum = async (event: any) => {
    event.preventDefault();

    if (newAlbum.current?.value) {
      const newAlb: IAlbum = {
        userId: user.id,
        id: albumsUser.length + 1,
        title: newAlbum.current?.value,
      };
      const newAlbumsUser: any = [...albumsUser, newAlb];
      const statusPost = await postData(`/albums`, newAlbumsUser);

      if (statusPost.statusText === 'Created') {
        setAlbumsUser(newAlbumsUser);
        newAlbum.current.value = '';
      }
    }
  };

  // Delete album
  const onDeleteAlbum = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.dataset.id) return;
    const id = +event.currentTarget.dataset.id;
    const deleteAlbum: any = await deleteData(`/albums/${id}`);

    if (deleteAlbum.statusText === 'OK') {
      const newAlbums = albumsUser.filter((album: IAlbum) => {
        return album.id !== id;
      });
      setAlbumsUser(newAlbums);
    }
  };

  //Handle Error
  if (errorUserInfo) {
    return <ErrorHandle message={errorMessage} />;
  }

  return (
    <Container maxWidth="xl">
      {errorUserInfo && <ErrorHandle message="Not found" />}
      {!errorUserInfo && (
        <Box className={classes.container}>
          <Typography variant="h3">{user.name}</Typography>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography m="2rem 0 0.6rem" variant="h4">
                  Personal:
                </Typography>
                <Box className={classes.box}>
                  <Typography>Id:</Typography>
                  <Typography>{user.id}</Typography>
                </Box>
                <Box className={classes.box}>
                  <Typography>UserName:</Typography>
                  <Typography>{user.username}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography m="2rem 0 0.6rem" variant="h4">
                  Address:
                </Typography>
                <Box className={classes.box}>
                  <Typography>Street:</Typography>
                  <Typography>{user.address.street}</Typography>
                </Box>
                <Box className={classes.box}>
                  <Typography>Suite:</Typography>
                  <Typography>{user.address.suite}</Typography>
                </Box>
                <Box className={classes.box}>
                  <Typography>City:</Typography>
                  <Typography>{user.address.city}</Typography>
                </Box>
                <Box className={classes.box}>
                  <Typography>Zipcode:</Typography>
                  <Typography>{user.address.zipcode}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography m="2rem 0 0.6rem" variant="h4">
                  Company:
                </Typography>
                <Box className={classes.box}>
                  <Typography>Name:</Typography>
                  <Typography>{user.company.name}</Typography>
                </Box>
                <Box className={classes.box}>
                  <Typography>CatchPhrase:</Typography>
                  <Typography>{user.company.catchPhrase}</Typography>
                </Box>
                <Box className={classes.box}>
                  <Typography>Bs:</Typography>
                  <Typography>{user.company.bs}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {edit && (
                <Fragment>
                  <Box>
                    <Formik
                      initialValues={{
                        email: user.email,
                        phone: user.phone,
                        website: user.website,
                        disable: true,
                      }}
                      validationSchema={validate}
                      onSubmit={onSubmitForm}
                      validate={validateOnChange}
                    >
                      {(values) => {
                        return (
                          <Form className={classes.form}>
                            <label>Email:</label>
                            <Field name="email"></Field>
                            <label>Phone:</label>
                            <Field name="phone"></Field>
                            <label>Website:</label>
                            <Field name="website"></Field>
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                              disabled={!isSubmit}
                            >
                              Submit
                            </Button>
                            <Button
                              sx={{ margin: '0 1rem' }}
                              variant="contained"
                              color="primary"
                              onClick={onCancelHandle}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={onResetForm.bind(null, values.resetForm)}
                              variant="contained"
                              color="error"
                            >
                              Reset
                            </Button>
                          </Form>
                        );
                      }}
                    </Formik>
                  </Box>
                </Fragment>
              )}

              {!edit && (
                <Fragment>
                  <Box>
                    <Typography m="2rem 0 0.6rem" variant="h4">
                      Contact:
                    </Typography>
                    <Box className={classes.box}>
                      <Typography>Email:</Typography>
                      <Typography>{user.email}</Typography>
                    </Box>
                    <Box className={classes.box}>
                      <Typography>Website:</Typography>
                      <Typography>{user.website}</Typography>
                    </Box>
                    <Box className={classes.box}>
                      <Typography>Phone:</Typography>
                      <Typography>{user.phone}</Typography>
                    </Box>
                  </Box>
                  <Button
                    sx={{ marginRight: '1rem', marginTop: '1rem' }}
                    variant="contained"
                    color="success"
                    onClick={onEditHandle}
                  >
                    Edit
                  </Button>
                </Fragment>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      <Box className={classes.container}>
        <Typography fontSize="1.6rem">Photo Albums:</Typography>
        <Box sx={{ maxWidth: '50%', marginBottom: '1rem' }}>
          <form onSubmit={onAddNewAlbum} className={classes.form}>
            <input
              ref={newAlbum}
              className={classes.style}
              type="text"
              placeholder="Title of new album"
            />
            <Button type="submit" color="success" variant="contained">
              New Album
            </Button>
          </form>
        </Box>
        <Grid container spacing={2}>
          {albumsUser.map((albumUser: IAlbum, index) => {
            return (
              <Grid key={albumUser.id} item xs={12} md={6}>
                <Box className={classes.boxPhotos}>
                  <Typography>{index + 1}</Typography>
                  <Typography>{albumUser.title}</Typography>
                  <Typography>
                    <button onClick={onDeleteAlbum} data-id={albumUser.id}>
                      X
                    </button>
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default UserInfo;
