<?php
define( 'WP_CACHE', true ); // Added by Turbo Cache

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'audicore_wp57253' );

/** MySQL database username */
define( 'DB_USER', 'audicore_wp57253' );

/** MySQL database password */
define( 'DB_PASSWORD', '@5huk3S8@p' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'jlxuttlfxfkzldhyvqfvqiaar6yrwglnhsnbgbmleolgwsw97e0mxcxnsbccycuj' );
define( 'SECURE_AUTH_KEY',  'lwsmtbadxy0wyuk5ycchxjdlbyk8nuzewxoueqley6tdupf5fn0wvecnypdltcf2' );
define( 'LOGGED_IN_KEY',    'n0hagr4ygwtp0sfdkniidrjjuiecteh58gd7jpb6mta0ut2iqccmsv9k0hcmbrwf' );
define( 'NONCE_KEY',        'iko6bzxfylk36mrrlrqiv3znhwi1pf1fudnminxk052hy5an7weexqxcvzne9fug' );
define( 'AUTH_SALT',        'afcbnimfn99m7zdwqsfs6bjutznuilnyrqdv8umfvujfxht0liovikmkaykc5ccq' );
define( 'SECURE_AUTH_SALT', 'ygzfn7mfkbsqivbr2uiwshtk8xopmamoqnhrxaqdwae8i7wof4oobloob6nrorwd' );
define( 'LOGGED_IN_SALT',   'qhaxlf1wr48lbvffuyt4b9auzhjojev5hqduuxuzvokrpbyifihawuzohmr35coy' );
define( 'NONCE_SALT',       'emdd8ief0j9et3kn6xinc8cb7m1juccmfbivrifu9lakkpc1keqalulv1fwol3so' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

define( 'WP_AUTO_UPDATE_CORE', 'minor' );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
