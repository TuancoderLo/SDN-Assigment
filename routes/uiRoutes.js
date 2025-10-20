const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Perfume Store',
        page: 'home'
    });
});

// Perfumes page
router.get('/perfumes', (req, res) => {
    res.render('perfumes/index', { 
        title: 'All Perfumes',
        page: 'perfumes'
    });
});

// Single perfume page
router.get('/perfumes/:id', (req, res) => {
    res.render('perfumes/detail', { 
        title: 'Perfume Details',
        page: 'perfumes',
        perfumeId: req.params.id
    });
});

// Brands page
router.get('/brands', (req, res) => {
    res.render('brands/index', { 
        title: 'All Brands',
        page: 'brands'
    });
});

// Members page
router.get('/members', (req, res) => {
    res.render('members/index', { 
        title: 'Members',
        page: 'members'
    });
});

// Auth pages
router.get('/login', (req, res) => {
    res.render('auth/login', { 
        title: 'Login',
        page: 'login'
    });
});

router.get('/register', (req, res) => {
    res.render('auth/register', { 
        title: 'Register',
        page: 'register'
    });
});

module.exports = router;