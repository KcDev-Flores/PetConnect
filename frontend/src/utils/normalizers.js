function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toArray(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return payload ? [payload] : [];
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function unwrapList(payload, keys = []) {
  return toArray(payload, ["data", "items", "records", ...keys]);
}

export function normalizePet(rawPet, index = 0) {
  const source = rawPet?.json ?? rawPet;
  const pet = source?.pet ?? source?.pets ?? source?.animal ?? source?.pet_profile ?? source ?? {};
  const owner = pet.owner ?? source?.owner ?? pet.user ?? source?.user ?? {};
  const id = firstValue(pet.id, pet.petId, pet.pet_id, source?.petId, source?.pet_id, `pet-${index}`);
  const species = firstValue(pet.species, pet.type, pet.animalType, pet.animal_type, "Mascota");

  return {
    id,
    ownerId: firstValue(pet.ownerId, pet.owner_id, pet.userId, pet.user_id, owner.id, source?.ownerId, source?.userId),
    name: firstValue(pet.name, pet.petName, pet.pet_name, "Mascota"),
    species,
    breed: firstValue(pet.breed, pet.race, pet.raza, "Raza por definir"),
    age: firstValue(pet.age, pet.edad, "Edad por confirmar"),
    bio: firstValue(pet.bio, pet.description, pet.descripcion, "Perfil de mascota en PetConnect."),
    owner: firstValue(pet.ownerName, pet.owner_name, owner.name, owner.fullName, owner.email, "Dueno por confirmar"),
    icon: firstValue(pet.icon, species === "Gato" ? "cat" : "dog"),
    color: firstValue(pet.color, "#10B981"),
    photoUrl: firstValue(pet.photoUrl, pet.photo_url, pet.imageUrl, pet.image_url, pet.avatarUrl, pet.avatar_url, ""),
    followers: toNumber(firstValue(pet.followers, pet.followersCount, pet.followers_count), 0),
    posts: toNumber(firstValue(pet.posts, pet.postsCount, pet.posts_count, pet.publications), 0),
    passport: pet.passport ?? {
      code: firstValue(pet.passportCode, pet.passport_code, pet.passport_id, `PC-${String(id).padStart(6, "0")}`),
      microchip: firstValue(pet.microchip, pet.microchipCode, pet.microchip_code, "Pendiente"),
      issuedAt: firstValue(pet.issuedAt, pet.issued_at, ""),
      status: firstValue(pet.passportStatus, pet.passport_status, "Verificado"),
    },
    veterinaryInfo: pet.veterinaryInfo ?? pet.veterinary_info,
    travelInfo: pet.travelInfo ?? pet.travel_info,
  };
}

export function normalizePetList(payload) {
  return unwrapList(payload, ["pets", "animals", "profiles"]).map(normalizePet);
}

export function normalizePost(rawPost, index = 0) {
  const source = rawPost?.json ?? rawPost;
  const post = source?.post ?? source ?? {};
  const pet = post.pet ?? post.pets ?? {};
  const normalizedPet = Object.keys(pet).length ? normalizePet(pet, index) : null;
  const id = firstValue(post.id, post.postId, post.post_id, `post-${index}`);

  return {
    id,
    petId: firstValue(post.petId, post.pet_id, normalizedPet?.id),
    petName: firstValue(post.petName, post.pet_name, normalizedPet?.name, "Mascota"),
    icon: firstValue(post.icon, normalizedPet?.icon, "paw"),
    color: firstValue(post.color, normalizedPet?.color, "#10B981"),
    petPhotoUrl: firstValue(post.petPhotoUrl, post.pet_photo_url, normalizedPet?.photoUrl, ""),
    content: firstValue(post.content, post.description, post.caption, post.text, ""),
    image: firstValue(post.image, post.imageUrl, post.image_url, post.mediaUrl, post.media_url, post.photoUrl, post.photo_url, null),
    location: post.location
      ? typeof post.location === "string"
        ? { name: post.location }
        : post.location
      : firstValue(post.locationName, post.location_name)
        ? { name: firstValue(post.locationName, post.location_name) }
        : null,
    likes: toNumber(firstValue(post.likes, post.likesCount, post.likes_count), 0),
    comments: toNumber(firstValue(post.comments, post.commentsCount, post.comments_count), 0),
    commentsList: post.commentsList ?? post.comments_list ?? [],
    liked: Boolean(post.liked),
    time: firstValue(post.time, post.created_at, post.createdAt, "Recientemente"),
  };
}

export function normalizePostList(payload) {
  return unwrapList(payload, ["posts", "publications"]).map(normalizePost);
}

export function normalizeComment(rawComment, index = 0) {
  const source = rawComment?.json ?? rawComment;
  const comment = source?.comment ?? source ?? {};

  return {
    id: firstValue(comment.id, comment.commentId, comment.comment_id, `comment-${index}`),
    postId: firstValue(comment.postId, comment.post_id, source?.postId, source?.post_id),
    author: firstValue(comment.author, comment.authorName, comment.author_name, comment.userName, comment.user_name, "Usuario"),
    text: firstValue(comment.text, comment.body, comment.content, comment.comment, ""),
    time: firstValue(comment.time, comment.created_at, comment.createdAt, "Ahora"),
  };
}

export function normalizeCommentList(payload) {
  return unwrapList(payload, ["comments"]).map(normalizeComment);
}

export function normalizeVetRecord(rawRecord, index = 0) {
  const source = rawRecord?.json ?? rawRecord;
  const record = source?.record ?? source?.vaccine ?? source ?? {};

  return {
    id: firstValue(record.id, record.recordId, record.record_id, record.vaccineId, record.vaccine_id, `record-${index}`),
    petId: firstValue(record.petId, record.pet_id, source?.petId, source?.pet_id),
    title: firstValue(record.title, record.name, record.vaccine, record.type, "Registro veterinario"),
    status: firstValue(record.status, record.result, ""),
    date: firstValue(record.date, record.applied_at, record.created_at, record.createdAt, ""),
    notes: firstValue(record.notes, record.description, record.detail, ""),
  };
}

export function normalizeVetRecordList(payload) {
  return unwrapList(payload, ["vaccines", "vetRecords", "vet_records"]).map(normalizeVetRecord);
}

export function normalizeLostPet(rawReport, index = 0) {
  const source = rawReport?.json ?? rawReport;
  const report = source?.report ?? source?.lostPet ?? source?.lost_pet ?? source ?? {};
  const pet = report.pet ?? report.animal ?? {};
  const normalizedPet = Object.keys(pet).length ? normalizePet(pet, index) : null;
  const id = firstValue(report.id, report.reportId, report.report_id, `lost-${index}`);
  const petId = firstValue(report.petId, report.pet_id, normalizedPet?.id, id);

  return {
    id,
    petId,
    petName: firstValue(report.petName, report.pet_name, normalizedPet?.name, "Mascota"),
    species: firstValue(report.species, normalizedPet?.species, "Mascota"),
    breed: firstValue(report.breed, report.raza, normalizedPet?.breed, "Raza por definir"),
    age: firstValue(report.age, report.edad, normalizedPet?.age, "Edad por confirmar"),
    description: firstValue(report.description, report.notes, report.descripcion, normalizedPet?.bio, ""),
    owner: firstValue(report.owner, report.ownerName, report.owner_name, normalizedPet?.owner, "Dueno por confirmar"),
    icon: firstValue(report.icon, normalizedPet?.icon, "paw"),
    color: firstValue(report.color, normalizedPet?.color, "#EF4444"),
    photoUrl: firstValue(report.photoUrl, report.photo_url, report.imageUrl, report.image_url, normalizedPet?.photoUrl, ""),
    passport: report.passport ?? normalizedPet?.passport,
    lostLocation: firstValue(report.lostLocation, report.lost_location, report.lastSeen, report.last_seen, ""),
    lostDate: firstValue(report.lostDate, report.lost_date, report.lastSeenDate, report.last_seen_date, ""),
    contactPhone: firstValue(report.contactPhone, report.contact_phone, report.ownerPhone, report.owner_phone, report.phone, ""),
    reward: firstValue(report.reward, ""),
    notes: firstValue(report.notes, report.description, report.descripcion, normalizedPet?.bio, ""),
    createdAtLabel: firstValue(report.createdAtLabel, report.created_at, report.createdAt, report.time, "Alerta activa"),
    status: firstValue(report.status, "Perdido"),
    sightings: report.sightings ?? [],
  };
}

export function normalizeLostPetList(payload) {
  return unwrapList(payload, ["lostPets", "lost_pets", "reports", "alerts"]).map(normalizeLostPet);
}
