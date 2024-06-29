ALTER TABLE `users` ADD `url_img` TEXT NULL DEFAULT NULL AFTER `is_admin`;
ALTER TABLE `tickets` ADD `fechaCierre` DATETIME NULL DEFAULT NULL AFTER `idUsuario`;