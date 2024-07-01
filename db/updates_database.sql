ALTER TABLE `users` ADD `url_img` TEXT NULL DEFAULT NULL AFTER `is_admin`;
ALTER TABLE `tickets` ADD `fechaCierre` DATETIME NULL DEFAULT NULL AFTER `idUsuario`;

ALTER TABLE `users` CHANGE `is_admin` `is_admin` ENUM('true','false') 
CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'false';

