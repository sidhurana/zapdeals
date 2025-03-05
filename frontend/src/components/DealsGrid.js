// src/components/DealsGrid.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const DealsGrid = ({ deals, searchTerm }) => {
  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Latest Deals</h2>
      <Row className="g-4">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <Col key={deal.dealID} xs={12} sm={6} md={4} lg={3}>
              <Card className="shadow-sm h-100 border-0">
                <a href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} target="_blank" rel="noopener noreferrer">
                  <Card.Img variant="top" src={deal.thumb} className="p-2" />
                </a>
                <Card.Body>
                  <Card.Title className="text-truncate">{deal.title}</Card.Title>
                  <Card.Text>
                    <span className="text-muted text-decoration-line-through">${deal.normalPrice}</span>{" "}
                    <span className="text-danger fw-bold">${deal.salePrice}</span>
                  </Card.Text>
                  <Button variant="success" className="w-100" href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} target="_blank">
                    View Deal
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

