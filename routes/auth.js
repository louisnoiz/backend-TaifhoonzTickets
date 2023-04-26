// const express = require("express");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config');

passport.use(new GoogleStrategy({
  clientID: '548190912893-23ss693ta1hlv72u1pj17devm37m8c6e.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/google/callback',
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      const email = profile.emails[0]?.value;
      const firstname = profile.name.givenName;
      const lastname = profile.name.familyName;
      console.log('Received user data:', email, profile.name);

      if (!email) {
        throw new Error('No email found in profile');
      }

      const conn = await pool.getConnection();

      await conn.beginTransaction();
      const [result, fields] = await conn.execute(
        'SELECT id FROM user WHERE email = ?',
        [email]
      );
      if (result.length > 0) {
        console.log('User already exists in database:', email);
        await conn.rollback();
        conn.release();
        done(null, profile);
        return;
      }

      const [insertResult, insertFields] = await conn.execute(
        'INSERT INTO user (email, firstname, lastname) VALUES (?, ?, ?)',
        [email, firstname, lastname]
      );
      console.log('User has been saved to database:', insertResult);


      await conn.commit();
      conn.release();

      done(null, profile);
    } catch (error) {
      console.error(error);
      done(error, null);
    }
  }

));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const conn = await pool.getConnection();

    await conn.beginTransaction();
    const [rows, fields] = await conn.execute(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );

    if (!rows.length) { // ไม่พบข้อมูลผู้ใช้
      done(null, null);
    } else {
      const user = rows[0];
      done(null, user);
    }
  } catch (error) {
    done(error, null);
  }
});

