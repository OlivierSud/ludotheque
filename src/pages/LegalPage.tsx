import { useNavigate } from 'react-router-dom';

interface LegalPageProps {
  readonly kind: 'mentions' | 'confidentialite';
}

export function LegalPage({ kind }: LegalPageProps) {
  const navigate = useNavigate();
  const title = kind === 'mentions' ? 'Mentions légales' : 'Politique de confidentialité';

  return (
    <div className="screen__inner">
      <header className="page-header">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <h1 className="page-title">{title}</h1>
        <span className="form-header__spacer" />
      </header>

      <article className="legal-content">
        {kind === 'mentions' ? (
          <>
            <h2>1. Présentation et statut du site</h2>
            <p>
              Le site <strong>La Ludothèque</strong> est un projet personnel indépendant édité à
              titre non professionnel au sens de l'article 6-III de la loi n° 2004-575 du 21 juin
              2004 pour la confiance dans l'économie numérique (LCEN).
            </p>
            <p>
              Ce répertoire partagé a pour vocation de référencer, classer et faire découvrir des
              jeux pédagogiques, à titre informatif et gratuit, sans aucune activité commerciale ni
              lucrative.
            </p>

            <h2>2. Éditeur et contact</h2>
            <p>
              <strong>Responsable de la publication :</strong> Olivier Sud (particulier / éditeur
              non professionnel).
            </p>
            <p>
              <strong>Contact :</strong> pour toute question ou demande de renseignement, vous
              pouvez contacter l'éditeur via le dépôt officiel du projet sur GitHub :{' '}
              <a
                href="https://github.com/oliviersud/ludotheque"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/oliviersud/ludotheque
              </a>
              .
            </p>

            <h2>3. Hébergement</h2>
            <p>Le site et son répertoire s'appuient sur les services suivants :</p>
            <ul>
              <li>
                <strong>Hébergement du site web :</strong> GitHub, Inc. — 88 Colin P. Kelly Jr.
                Street, San Francisco, CA 94107, États-Unis (
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  https://github.com
                </a>
                ).
              </li>
              <li>
                <strong>Gestion du répertoire de données :</strong> Google LLC — 1600 Amphitheatre
                Parkway, Mountain View, CA 94043, États-Unis (
                <a href="https://google.com" target="_blank" rel="noopener noreferrer">
                  https://google.com
                </a>
                ).
              </li>
            </ul>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              La structure globale du site, les fonctionnalités logicielles et les contenus rédigés
              par l'éditeur sont protégés au titre du droit d'auteur.
            </p>
            <p>
              Les marques, noms de jeux, visuels ou logos cités dans le répertoire appartiennent à
              leurs auteurs, éditeurs ou ayants droit respectifs. Leur mention sur ce site
              intervient uniquement dans un but de présentation descriptive et d'information du
              public.
            </p>

            <h2>5. Liens externes et responsabilité</h2>
            <p>
              Le site propose des liens hypertextes dirigeant vers des sites Internet tiers
              (éditeurs de jeux, ressources pédagogiques, etc.). Ces liens sont fournis à titre de
              commodité. L'éditeur n'exerce aucun contrôle sur ces sites indépendants et ne saurait
              être tenu responsable de leurs contenus, services ou évolutions.
            </p>

            <h2>6. Modération et droit de suppression par l'administrateur</h2>
            <p>
              L'ajout et l'édition de jeux sont ouverts aux contributeurs afin d'enrichir
              collectivement la collection.
            </p>
            <p>
              Toutefois, l'administrateur du site se réserve expressément le droit de modérer,
              modifier ou supprimer à tout moment et sans préavis toute fiche de jeu, donnée ou lien
              qui ne correspondrait pas à l'usage et à la vocation de l'application (notamment en
              cas de contenu hors-sujet, non pédagogique, inapproprié, erroné, publicitaire ou
              abusif).
            </p>
          </>
        ) : (
          <>
            <h2>1. Principe : zéro compte et confidentialité par défaut</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE
              2016/679) et à la loi Informatique et Libertés modifiée, le service est conçu pour
              garantir le respect total de votre vie privée :
            </p>
            <ul>
              <li>Aucun compte utilisateur n'est requis ni proposé.</li>
              <li>
                Aucun nom, prénom, numéro de téléphone ou adresse e-mail n'est collecté pour
                consulter ou utiliser la ludothèque.
              </li>
            </ul>

            <h2>2. Nature des données et modération</h2>
            <p>
              Lors de l'ajout ou de la modification d'un jeu, seules les informations publiques
              relatives à l'œuvre ludique sont enregistrées : son nom, l'adresse de son site web
              public et les critères de classification retenus.
            </p>
            <p>
              Ces données ont vocation à être librement consultables par l'ensemble des visiteurs.
            </p>
            <p>
              <strong>Droit de suppression par l'administrateur :</strong> afin de garantir la
              pertinence pédagogique et la qualité du répertoire, l'administrateur se réserve le
              droit de supprimer toute contribution qui ne correspondrait pas à l'usage normal de
              l'application ou qui présenterait un caractère abusif ou inapproprié.
            </p>

            <h2>3. Sécurité et protection contre les abus</h2>
            <p>
              Pour préserver la disponibilité du service et éviter le spam automatisé lors de
              l'envoi de formulaires, un mécanisme de vérification anti-robot automatisé est en
              place. Aucune adresse IP n'est stockée en clair ni conservée de manière durable dans
              le répertoire de jeux.
            </p>

            <h2>4. Cookies et stockage local</h2>
            <p>
              Ce site{' '}
              <strong>n'utilise aucun cookie publicitaire, aucun traceur de profilage</strong> ni
              aucun outil d'analyse d'audience externe.
            </p>
            <p>
              Seul un stockage technique local sur votre propre appareil (via le{' '}
              <code>localStorage</code> de votre navigateur) est utilisé pour :
            </p>
            <ul>
              <li>Mémoriser vos critères de filtres pendant votre navigation.</li>
              <li>
                Mettre en cache la liste des jeux afin de vous permettre de consulter la ludothèque
                même sans connexion Internet (mode hors-ligne de l'application).
              </li>
            </ul>
            <p>
              Conformément aux recommandations de la CNIL, ces données strictement nécessaires au
              bon fonctionnement du service ne requièrent aucun consentement préalable.
            </p>

            <h2>5. Vos droits et suppression d'une mention</h2>
            <p>
              Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de
              rectification et d'effacement pour toute information vous concernant qui aurait été
              partagée sur le répertoire.
            </p>
            <p>
              Pour solliciter la modification ou le retrait d'une fiche ou d'un lien, il vous suffit
              de contacter l'éditeur via le dépôt officiel du projet :{' '}
              <a
                href="https://github.com/oliviersud/ludotheque"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/oliviersud/ludotheque
              </a>
              .
            </p>
            <p>
              Vous conservez également le droit d'introduire une réclamation auprès de l'autorité de
              contrôle compétente, la Commission Nationale de l'Informatique et des Libertés (CNIL -{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                www.cnil.fr
              </a>
              ).
            </p>
          </>
        )}
      </article>
    </div>
  );
}
