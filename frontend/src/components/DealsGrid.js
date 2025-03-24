// src/components/DealsGrid.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const DealsGrid = ({ deals, searchTerm }) => {
  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Latest eBay Deals</h2>
      <Row className="g-4">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <Card className="shadow-sm h-100 border-0">
                <a
                  href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(deal.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card.Img
                    variant="top"
                    src={deal.image || "https://via.placeholder.com/300?text=No+Image"}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300?text=No+Image";
                    }}
                    className="p-2"
                    alt={deal.title}
                  />
                </a>
                <Card.Body>
                  <Card.Title className="text-truncate">{deal.title}</Card.Title>
                  <Card.Text className="text-danger fw-bold">
                    {deal.price ? `$${deal.price}` : "Price Not Available"}
                  </Card.Text>
                  <Button
                    variant="success"
                    className="w-100"
                    href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(deal.title)}`}
                    target="_blank"
                  >
                    View on eBay
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No deals found</p>
        )}
      </Row>
    </Container>
  );
};

export default DealsGrid;

