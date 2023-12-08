# Utiliser une image de base avec Apache et PHP
FROM php:7.4-apache

# Définir le répertoire de travail dans le conteneur
WORKDIR /var/www/html

# Copier les fichiers HTML, CSS, JS et autres du répertoire local vers le conteneur
COPY ./ /var/www/html


# Copier le fichier de configuration Apache
COPY default.conf /etc/apache2/sites-available/000-default.conf


RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html



# Exposer le port 8081 pour que le serveur Apache puisse écouter
EXPOSE 80

# Lancer le serveur Apache en mode daemon
CMD ["apache2-foreground"]

